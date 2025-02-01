import {
    canHandle,
    FeedData,
    FeedEntryData,
    FeedEntryGroup,
    FeedEntryLink,
} from "./feed";
import { v4 as uuidv4 } from "uuid";

const locale = new Intl.Locale(navigator.language);

function isValidString(s: any): s is string {
    return s && typeof s === "string";
}

async function fetchXml(url: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const text = await response.text();
    return new DOMParser().parseFromString(text, "text/xml");
}

export async function fetchOpdsV1_2FeedData(url: string): Promise<FeedData> {
    const xmlDocument = await fetchXml(url);
    const entries: FeedEntryData[] = [];
    const feedTitle =
        xmlDocument.querySelector("feed title")?.textContent ??
        "OPDS v1.2 Feed";
    for (const element of xmlDocument.querySelectorAll("feed entry")) {
        const id = element.querySelector("id")?.textContent;
        if (!isValidString(id)) {
            continue;
        }
        const title = element.querySelector("title")?.textContent;
        if (!isValidString(title)) {
            continue;
        }
        const updated = element.querySelector("updated")?.textContent;
        if (!isValidString(updated)) {
            continue;
        }
        const links: FeedEntryLink[] = [];
        for (const linkElement of element.querySelectorAll("link")) {
            const rel = linkElement.getAttribute("rel");
            const href = linkElement.getAttribute("href");
            if (!isValidString(href)) {
                continue;
            }
            const type = linkElement.getAttribute("type");
            if (!isValidString(type)) {
                continue;
            }
            const absoluteHref = new URL(href, url).toString();
            links.push({ rel, href: absoluteHref, type });
        }
        const creators = [
            ...element.querySelectorAll("author"),
            ...element.querySelectorAll("contributor"),
        ]
            .map((e) => e.querySelector("name")?.textContent)
            .filter(isValidString);
        const publishers = [
            ...element.getElementsByTagNameNS(
                "http://purl.org/dc/terms/",
                "publisher",
            ),
        ]
            .map((e) => e.textContent)
            .filter(isValidString);
        const identifier = element.getElementsByTagNameNS(
            "http://purl.org/dc/terms/",
            "identifier",
        )[0]?.textContent;
        const languages = [
            ...element.getElementsByTagNameNS(
                "http://purl.org/dc/terms/",
                "language",
            ),
        ]
            .map((e) => e.textContent)
            .filter(isValidString);
        const published = element.querySelector("published")?.textContent;
        const rights = element.querySelector("rights")?.textContent;
        const subjects = [...element.querySelectorAll("category")]
            .map((e) => e.getAttribute("label") ?? e.getAttribute("term"))
            .filter(isValidString);
        const descriptionElement =
            element.querySelector("content") ??
            element.querySelector("summary");
        const xmlSerializer = new XMLSerializer();
        const description = descriptionElement
            ? [...descriptionElement.childNodes]
                  .map((n) => xmlSerializer.serializeToString(n))
                  .join("")
            : null;
        const entry = {
            id,
            title,
            updated,
            identifier,
            languages,
            creators,
            publishers,
            published,
            rights,
            subjects,
            description,
            links,
        };
        if (!canHandle(entry)) {
            continue;
        }
        entries.push(entry);
    }
    return { title: feedTitle, entries, groups: [] };
}

function parseV2_0StringOrLanguageObject(json: any): string | null {
    return typeof json === "string" && json
        ? json
        : typeof json === "object" && !Array.isArray(json) && json
          ? json[
                Object.keys(json).find((l) => l.startsWith(locale.language)) ??
                    Object.keys(json)[0]
            ]
          : null;
}

function parseV2_0Link(jsonLink: any, baseUrl: string): FeedEntryLink | null {
    const rel = jsonLink.rel;
    if (rel && typeof rel !== "string") {
        return null;
    }
    const href = jsonLink.href;
    if (!href || typeof href !== "string") {
        return null;
    }
    const type = jsonLink.type;
    if (!type || typeof type !== "string") {
        return null;
    }
    const absoluteHref = new URL(href, baseUrl).toString();
    return { rel, href: absoluteHref, type };
}

function parseV2_0Links(jsonLinks: any, baseUrl: string): FeedEntryLink[] {
    if (!jsonLinks || !Array.isArray(jsonLinks)) {
        return [];
    }
    return jsonLinks.map((l) => parseV2_0Link(l, baseUrl)).filter((l) => !!l);
}

function parseV2_0ImageLinks(
    jsonImages: any,
    baseUrl: string,
): FeedEntryLink[] {
    if (!jsonImages || !Array.isArray(jsonImages)) {
        return [];
    }
    return jsonImages
        .map((i) => {
            const link = parseV2_0Link(i, baseUrl);
            if (!link) {
                return null;
            }
            return { ...link, width: i.width, height: i.height };
        })
        .filter((l) => !!l)
        .sort((a, b) => {
            const aWidth = a.width;
            const aHeight = a.height;
            const bWidth = b.width;
            const bHeight = b.height;
            const aHasUnknownSize =
                !aWidth ||
                typeof aWidth !== "number" ||
                !aHeight ||
                typeof aHeight !== "number";
            const bHasUnknownSize =
                !bWidth ||
                typeof bWidth !== "number" ||
                !bHeight ||
                typeof bHeight !== "number";
            if (aHasUnknownSize && bHasUnknownSize) {
                return 0;
            }
            if (aHasUnknownSize) {
                return 1;
            }
            if (bHasUnknownSize) {
                return -1;
            }
            const aSize = aWidth * aHeight;
            const bSize = bWidth * bHeight;
            return bSize - aSize;
        });
}

function parseV2_0Names(json: any): string[] {
    if (Array.isArray(json)) {
        return json.map(parseV2_0Names).flat();
    }
    const name =
        json && typeof json !== "string"
            ? parseV2_0StringOrLanguageObject(json.name)
            : parseV2_0StringOrLanguageObject(json);
    return isValidString(name) ? [name] : [];
}

function parseV2_0NavigationEntries(
    navigation: any,
    baseUrl: string,
    now: string,
) {
    const entries: FeedEntryData[] = [];
    for (const navigationItem of navigation) {
        const title = navigationItem.title;
        if (!isValidString(title)) {
            continue;
        }
        const link = parseV2_0Link(navigationItem, baseUrl);
        if (!link) {
            continue;
        }
        const links = [link];
        const id = uuidv4();
        entries.push({ id, title, updated: now, links });
    }
    return entries;
}

function parseV2_0PublicationEntries(
    publications: any,
    baseUrl: string,
    now: string,
) {
    const entries: FeedEntryData[] = [];
    for (const publication of publications) {
        const title = parseV2_0StringOrLanguageObject(
            publication.metadata?.title,
        );
        if (!isValidString(title)) {
            continue;
        }
        const publicationLinks = publication.links ?? [];
        const publicationImages = publication.images ?? [];
        const links = [
            ...parseV2_0Links(publicationLinks, baseUrl),
            ...parseV2_0ImageLinks(publicationImages, baseUrl),
        ];
        const id = uuidv4();
        const updated = publication.metadata?.modified ?? now;
        const publicationIdentifier = publication.metadata?.identifier;
        const identifier =
            publicationIdentifier && typeof publicationIdentifier === "string"
                ? publicationIdentifier
                : null;
        const publicationLanguage = publication.metadata?.language;
        const languages = isValidString(publicationLanguage)
            ? [publicationLanguage]
            : Array.isArray(publicationLanguage)
              ? publicationLanguage.filter(isValidString)
              : [];
        const creators = [
            publication.metadata?.author,
            publication.metadata?.translator,
            publication.metadata?.editor,
            publication.metadata?.artist,
            publication.metadata?.illustrator,
            publication.metadata?.letterer,
            publication.metadata?.penciler,
            publication.metadata?.colorist,
            publication.metadata?.inker,
            publication.metadata?.narrator,
        ]
            .map(parseV2_0Names)
            .flat();
        const publishers = parseV2_0Names(publication.metadata?.publisher);
        const published = publication.metadata?.published;
        const subjects = parseV2_0Names(publication.metadata?.subject);
        const publicationDescription = publication.metadata?.description;
        const description = isValidString(publicationDescription)
            ? publicationDescription
            : null;
        entries.push({
            id,
            title,
            updated,
            identifier,
            languages,
            creators,
            publishers,
            published,
            rights: null,
            subjects,
            description,
            links,
        });
    }
    return entries;
}

function parseV2_0Groups(jsonGroups: any, baseUrl: string, now: string) {
    if (!jsonGroups || !Array.isArray(jsonGroups)) {
        return [];
    }
    const groups: FeedEntryGroup[] = [];
    for (const jsonGroup of jsonGroups) {
        const title = parseV2_0StringOrLanguageObject(
            jsonGroup.metadata?.title,
        );
        if (!isValidString(title)) {
            continue;
        }
        const navigation = jsonGroup.navigation ?? [];
        const publications = jsonGroup.publications ?? [];
        const entries = [
            ...parseV2_0NavigationEntries(navigation, baseUrl, now),
            ...parseV2_0PublicationEntries(publications, baseUrl, now),
        ];
        const href = parseV2_0Links(jsonGroup.links, baseUrl).find(
            (l) => l.rel === "self",
        )?.href;
        const absoluteHref = !href ? null : new URL(href, baseUrl).toString();
        groups.push({ title, href: absoluteHref, entries });
    }
    return groups;
}

export async function fetchOpdsV2_0FeedData(url: string): Promise<FeedData> {
    const response = await fetch(url);
    const jsonData = await response.json();
    const feedTitle = jsonData.metadata?.title ?? "OPDS v2.0 Feed";
    const now = new Date().toISOString();
    const navigation = jsonData.navigation ?? [];
    const publications = jsonData.publications ?? [];
    const entries = [
        ...parseV2_0NavigationEntries(navigation, url, now),
        ...parseV2_0PublicationEntries(publications, url, now),
    ];
    const jsonGroups = jsonData.groups;
    const groups = parseV2_0Groups(jsonGroups, url, now);
    return { title: feedTitle, entries, groups };
}
