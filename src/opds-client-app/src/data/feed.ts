export interface FeedEntryData {
    id: string;
    title: string;
    updated: string;
    identifier?: string | null;
    language?: string | null;
    authors?: string[] | null;
    contributors?: string[] | null;
    published?: string | null;
    rights?: string | null;
    subjects?: string[] | null;
    description?: string | null;
    links: FeedEntryLink[];
}

export interface FeedEntryLink {
    rel: string;
    href: string;
    type: string;
}

export function getImageLink(data: FeedEntryData) {
    return (
        data.links.find((l) => l.rel === "http://opds-spec.org/image") ??
        data.links.find((l) => l.rel === "http://opds-spec.org/image/thumbnail")
    );
}

export function getNavigationLink(data: FeedEntryData) {
    return data.links.find(
        (l) =>
            l.rel === "subsection" ||
            l.rel === "http://opds-spec.org/sort/new" ||
            l.rel === "http://opds-spec.org/sort/popular",
    );
}

export function getAcquisitionLinks(data: FeedEntryData) {
    return data.links.filter(
        (l) => l.rel === "http://opds-spec.org/acquisition",
    );
}

export function canHandle(data: FeedEntryData) {
    return getNavigationLink(data) || getAcquisitionLinks(data).length > 0;
}

export function base64Encode(data: FeedEntryData) {
    return btoa(encodeURIComponent(JSON.stringify(data)));
}

function isFeedEntryLink(unknownData: unknown): unknownData is FeedEntryLink {
    const data = unknownData as FeedEntryLink;
    return (
        typeof data.rel === "string" &&
        typeof data.href === "string" &&
        typeof data.type === "string"
    );
}

function isFeedEntryData(unknownData: unknown): unknownData is FeedEntryData {
    const data = unknownData as FeedEntryData;
    return (
        typeof data.id === "string" &&
        typeof data.title === "string" &&
        Array.isArray(data.links) &&
        data.links.every((l) => isFeedEntryLink(l))
    );
}

export function base64Decode(stringData: string) {
    try {
        const data = JSON.parse(decodeURIComponent(atob(stringData)));
        if (!isFeedEntryData(data)) return undefined;
        return data;
    } catch {
        return undefined;
    }
}
