export interface FeedData {
    readonly title: string;
    readonly entries: readonly FeedEntryData[];
    readonly groups: readonly FeedGroup[];
    readonly pagination: FeedPagination;
}

export interface FeedPagination {
    readonly first?: string | null;
    readonly last?: string | null;
    readonly next?: string | null;
    readonly previous?: string | null;
}

export interface FeedEntryData {
    readonly id: string;
    readonly title: string;
    readonly updated: string;
    readonly identifier?: string | null;
    readonly languages?: readonly string[] | null;
    readonly creators?: readonly string[] | null;
    readonly publishers?: readonly string[] | null;
    readonly published?: string | null;
    readonly rights?: string | null;
    readonly subjects?: readonly string[] | null;
    readonly description?: string | null;
    readonly links: readonly FeedLink[];
}

export interface FeedLink {
    readonly rel?: string | null;
    readonly href: string;
    readonly type: string;
}

export interface FeedGroup {
    readonly title: string;
    readonly href?: string | null;
    readonly entries: readonly FeedEntryData[];
}

export function getImageLink(data: FeedEntryData) {
    return (
        data.links.find((l) => l.rel === "http://opds-spec.org/image") ??
        data.links.find(
            (l) => l.rel === "http://opds-spec.org/image/thumbnail",
        ) ??
        data.links.find(
            (l) => l.type === "image/jpeg" || l.type === "image/png",
        )
    );
}

export function getNavigationLink(data: FeedEntryData) {
    return data.links.find(
        (l) =>
            l.rel === "subsection" ||
            l.rel === "http://opds-spec.org/sort/new" ||
            l.rel === "http://opds-spec.org/sort/popular" ||
            l.type === "application/opds+json",
    );
}

export function getAcquisitionLinks(data: FeedEntryData) {
    return data.links.filter(
        (l) =>
            l.rel === "http://opds-spec.org/acquisition" ||
            l.rel === "http://opds-spec.org/acquisition/open-access",
    );
}

export function canHandle(data: FeedEntryData) {
    return getNavigationLink(data) || getAcquisitionLinks(data).length > 0;
}

export function base64Encode(data: FeedEntryData) {
    return btoa(encodeURIComponent(JSON.stringify(data)));
}

function isFeedEntryLink(unknownData: unknown): unknownData is FeedLink {
    const data = unknownData as FeedLink;
    return (
        (typeof data.rel === "string" ||
            data.rel === undefined ||
            data.rel === null) &&
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
