import { FeedEntryData, base64Encode, getNavigationLink } from "../data/feed";
import iconStyles from "../styles/icon.module.css";
import { FeedEntryImage } from "./FeedEntryImage";
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Text, Tooltip } from "@mantine/core";
import { useNavigate } from "react-router-dom";

interface Props {
    readonly data: FeedEntryData;
    readonly version: string;
}

export function FeedEntry({ data, version }: Props) {
    const navigationLink = getNavigationLink(data);
    const navigate = useNavigate();
    return (
        <Card>
            <Card.Section>
                <FeedEntryImage
                    data={data}
                    fallback={
                        navigationLink ? (
                            <FontAwesomeIcon
                                icon={faFolder}
                                className={iconStyles.icon}
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={faFile}
                                className={iconStyles.icon}
                            />
                        )
                    }
                    onClick={() =>
                        navigationLink
                            ? navigate(
                                  `/${version}/${btoa(navigationLink.href)}`,
                              )
                            : navigate(`/entry/${base64Encode(data)}`)
                    }
                />
            </Card.Section>
            <Tooltip label={data.title}>
                <Text truncate="end">{data.title}</Text>
            </Tooltip>
        </Card>
    );
}
