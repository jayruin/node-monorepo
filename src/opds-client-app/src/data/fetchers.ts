import { canHandle, FeedEntryData, FeedEntryLink } from "./feed";

export async function fetchXml(url: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const text = await response.text();
    return new DOMParser().parseFromString(text, "text/xml");
}

export async function fetchOpdsV1_2FeedData(
    url: string,
): Promise<FeedEntryData[]> {
    const xmlDocument = await fetchXml(url);
    const data: FeedEntryData[] = [];
    for (const element of xmlDocument.querySelectorAll("feed entry")) {
        const id = element.querySelector("id")?.textContent;
        if (!id) {
            continue;
        }
        const title = element.querySelector("title")?.textContent;
        if (!title) {
            continue;
        }
        const updated = element.querySelector("updated")?.textContent;
        if (!updated) {
            continue;
        }
        const links: FeedEntryLink[] = [];
        for (const linkElement of element.querySelectorAll("link")) {
            const rel = linkElement.getAttribute("rel");
            if (!rel) {
                continue;
            }
            const href = linkElement.getAttribute("href");
            if (!href) {
                continue;
            }
            const type = linkElement.getAttribute("type");
            if (!type) {
                continue;
            }
            const absoluteHref = new URL(href, url).toString();
            links.push({ rel, href: absoluteHref, type });
        }
        const authors: string[] = [];
        for (const authorElement of element.querySelectorAll("author")) {
            const name = authorElement.querySelector("name")?.textContent;
            if (!name) {
                continue;
            }
            authors.push(name);
        }
        const contributors: string[] = [];
        for (const contributorElement of element.querySelectorAll(
            "contributor",
        )) {
            const name = contributorElement.querySelector("name")?.textContent;
            if (!name) {
                continue;
            }
            contributors.push(name);
        }
        const identifier = element.getElementsByTagNameNS(
            "http://purl.org/dc/terms/",
            "identifier",
        )[0]?.textContent;
        const language = element.getElementsByTagNameNS(
            "http://purl.org/dc/terms/",
            "language",
        )[0]?.textContent;
        const published = element.querySelector("published")?.textContent;
        const rights = element.querySelector("rights")?.textContent;
        const subjects: string[] = [];
        for (const subjectElement of element.querySelectorAll("category")) {
            const subject =
                subjectElement.getAttribute("label") ??
                subjectElement.getAttribute("term");
            if (!subject) {
                continue;
            }
            subjects.push(subject);
        }
        const descriptionElement =
            element.querySelector("content") ??
            element.querySelector("summary");
        const xmlSerializer = new XMLSerializer();
        const description = descriptionElement
            ? Array.from(descriptionElement.childNodes)
                  .map((n) => xmlSerializer.serializeToString(n))
                  .join("")
            : null;
        const entry = {
            id,
            title,
            updated,
            identifier,
            language,
            authors,
            contributors,
            published,
            rights,
            subjects,
            description,
            links,
        };
        if (!canHandle(entry)) {
            continue;
        }
        data.push(entry);
    }
    return data;
}
