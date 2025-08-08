import { Button } from "@mantine/core";
import { PropsWithChildren, RefAttributes } from "react";
import { useNavigate } from "react-router-dom";

interface Props extends RefAttributes<HTMLButtonElement> {
    readonly version: string;
    readonly feedUrl?: string | null;
}

export function GoToFeedButton({
    version,
    feedUrl,
    children,
    ref,
}: PropsWithChildren<Props>) {
    const navigate = useNavigate();
    return (
        <Button
            ref={ref}
            style={{
                visibility: feedUrl ? "visible" : "hidden",
                color: "var(--mantine-color-text)",
                backgroundColor: "var(--mantine-color-body)",
                borderColor: "var(--mantine-color-default-border)",
                borderWidth: "1px",
                borderStyle: "solid",
            }}
            onClick={() => {
                if (feedUrl) {
                    navigate(`/${version}/${btoa(feedUrl)}`);
                }
            }}
        >
            {children}
        </Button>
    );
}
