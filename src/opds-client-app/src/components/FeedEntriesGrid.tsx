import { FeedEntryData } from "../data/feed";
import gridStyles from "../styles/grid.module.css";
import { FeedEntry } from "./FeedEntry";

interface Props {
    readonly data: readonly FeedEntryData[];
    readonly version: string;
}

export default function FeedEntriesGrid({ data, version }: Props) {
    return (
        <div className={gridStyles.grid}>
            {data.map((d) => (
                <FeedEntry key={d.id} data={d} version={version} />
            ))}
        </div>
    );
}
