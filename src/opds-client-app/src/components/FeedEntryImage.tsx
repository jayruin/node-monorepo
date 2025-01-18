import { FeedEntryData, getImageLink } from "../data/feed";
import hoverStyles from "../styles/hover.module.css";
import { AspectRatio, Image } from "@mantine/core";
import { ReactNode } from "react";

interface Props {
    data: FeedEntryData;
    fallback: ReactNode;
    onClick?: () => void;
}

export function FeedEntryImage({ data, fallback, onClick = undefined }: Props) {
    const imageLink = getImageLink(data);
    return (
        <AspectRatio
            ratio={3 / 4}
            onClick={onClick}
            className={onClick ? hoverStyles["hover-pointer"] : undefined}
        >
            {imageLink ? <Image src={imageLink.href} /> : fallback}
        </AspectRatio>
    );
}
