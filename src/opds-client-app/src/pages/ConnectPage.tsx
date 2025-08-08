import { GoToFeedButton } from "../components/GoToFeedButton";
import pageStyles from "../styles/page.module.css";
import { Page } from "./Page";
import { faPlug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Center, Select, TextInput } from "@mantine/core";
import { useRef, useState } from "react";

export default function ConnectPage() {
    const [url, setUrl] = useState("");
    const versions = ["v1.2", "v2.0"];
    const [version, setVersion] = useState(versions[0]);
    const buttonRef = useRef<HTMLButtonElement>(null);
    return (
        <Page title="OPDS Client App">
            <Center className={pageStyles["page-100vh"]}>
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
                />
                <GoToFeedButton ref={buttonRef} version={version} feedUrl={url}>
                    <FontAwesomeIcon icon={faPlug} size="2x" />
                </GoToFeedButton>
            </Center>
        </Page>
    );
}
