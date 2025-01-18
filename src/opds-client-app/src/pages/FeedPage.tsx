import { ErrorMessage } from "../components/ErrorMessage";
import Feed from "../components/Feed";
import Loading from "../components/Loading";
import { FeedEntryData } from "../data/feed";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

interface Props {
    fetchFeedData: (url: string) => Promise<FeedEntryData[]>;
}

export function FeedPage(props: Props) {
    const params = useParams();
    const url = params.url;
    const decodedUrl = atob(url ?? "");
    const { isPending, error, data } = useQuery({
        queryKey: ["v1.2", url],
        queryFn: () => props.fetchFeedData(decodedUrl),
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
    return <Feed data={data} />;
}
