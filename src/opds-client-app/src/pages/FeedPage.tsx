import { ErrorMessage } from "../components/ErrorMessage";
import Feed from "../components/Feed";
import Loading from "../components/Loading";
import { NavBar } from "../components/NavBar";
import { FeedData } from "../data/feed";
import { Page } from "./Page";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

interface Props {
    readonly fetchFeedData: (url: string) => Promise<FeedData>;
    readonly version: string;
}

export function FeedPage({ fetchFeedData, version }: Props) {
    const params = useParams();
    const url = params.url;
    const decodedUrl = atob(url ?? "");
    const { isPending, error, data } = useQuery({
        queryKey: [version, url],
        queryFn: () => fetchFeedData(decodedUrl),
    });
    if (!url) {
        return <Navigate to="/" />;
    }
    if (isPending || !data) {
        return <Loading />;
    }
    if (error) {
        return <ErrorMessage error={error} />;
    }
    return (
        <Page title={data.title}>
            <NavBar currentVersion={version} currentUrl={decodedUrl} />
            <Feed data={data} version={version} />
        </Page>
    );
}
