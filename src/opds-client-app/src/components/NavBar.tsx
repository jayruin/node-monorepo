import { GoToFeedButton } from "./GoToFeedButton";
import { ToggleThemeButton } from "./ToggleThemeButton";
import { faPlug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex, Select, TextInput } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

interface Props {
    readonly currentVersion?: string | null;
    readonly currentUrl?: string | null;
}

export function NavBar({ currentVersion, currentUrl }: Props) {
    const versions = ["v1.2", "v2.0"];
    const validCurrentVersion =
        currentVersion && versions.includes(currentVersion)
            ? currentVersion
            : versions[0];
    const validCurrentUrl = currentUrl ?? "";
    const [url, setUrl] = useState(validCurrentUrl);
    const [version, setVersion] = useState(validCurrentVersion);
    const buttonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        setUrl(validCurrentUrl);
    }, [validCurrentUrl]);
    return (
        <Flex>
            <ToggleThemeButton />
            <Select
                data={versions}
                value={version}
                onChange={(value) => setVersion(value ?? versions[0])}
                w="5rem"
            />
            <TextInput
                value={url}
                onChange={(event) => setUrl(event.currentTarget.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        buttonRef.current?.click();
                    }
                }}
                flex="1"
            />
            <GoToFeedButton ref={buttonRef} version={version} feedUrl={url}>
                <FontAwesomeIcon icon={faPlug} size="2x" />
            </GoToFeedButton>
        </Flex>
    );
}
