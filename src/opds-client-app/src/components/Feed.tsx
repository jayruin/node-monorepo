import { FeedEntryData } from "../data/feed";
import gridStyles from "../styles/grid.module.css";
import { FeedEntry } from "./FeedEntry";

interface Props {
    data: FeedEntryData[];
}

export default function Feed({ data }: Props) {
    return (
        <div className={gridStyles.grid}>
            {data.map((d) => (
                <FeedEntry key={d.id} data={d} />
            ))}
        </div>
    );
}
