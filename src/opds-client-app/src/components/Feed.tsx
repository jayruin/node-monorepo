import { FeedData } from "../data/feed";
import hoverStyles from "../styles/hover.module.css";
import FeedEntriesGrid from "./FeedEntriesGrid";
import { GoToFeedButton } from "./GoToFeedButton";
import {
    faAngleLeft,
    faAngleRight,
    faAnglesLeft,
    faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Group, Stack, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

interface Props {
    readonly data: FeedData;
    readonly version: string;
}

export default function Feed({ data, version }: Props) {
    const navigate = useNavigate();
    return (
        <Stack>
            <Title order={1}>{data.title}</Title>
            <FeedEntriesGrid data={data.entries} version={version} />
            {data.groups.map((g) => (
                <Stack key={g.title.concat(g.href ?? "")}>
                    <Divider />
                    <Title
                        order={2}
                        onClick={() => {
                            const href = g.href;
                            if (href) {
                                navigate(`/${version}/${btoa(href)}`);
                            }
                        }}
                        className={
                            g.href ? hoverStyles["hover-pointer"] : undefined
                        }
                    >
                        {g.title}
                    </Title>
                    <FeedEntriesGrid data={g.entries} version={version} />
                </Stack>
            ))}
            <Group justify="center">
                <GoToFeedButton
                    version={version}
                    feedUrl={data.pagination.first}
                >
                    <FontAwesomeIcon icon={faAnglesLeft} size="2x" />
                </GoToFeedButton>

                <GoToFeedButton
                    version={version}
                    feedUrl={data.pagination.previous}
                >
                    <FontAwesomeIcon icon={faAngleLeft} size="2x" />
                </GoToFeedButton>

                <GoToFeedButton
                    version={version}
                    feedUrl={data.pagination.next}
                >
                    <FontAwesomeIcon icon={faAngleRight} size="2x" />
                </GoToFeedButton>

                <GoToFeedButton
                    version={version}
                    feedUrl={data.pagination.last}
                >
                    <FontAwesomeIcon icon={faAnglesRight} size="2x" />
                </GoToFeedButton>
            </Group>
        </Stack>
    );
}
