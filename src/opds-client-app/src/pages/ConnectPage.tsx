import pageStyles from "../styles/page.module.css";
import { Page } from "./Page";
import { faPlug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput, Center, Button, Select } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ConnectPage() {
    const [url, setUrl] = useState("");
    const versions = ["v1.2", "v2.0"];
    const [version, setVersion] = useState(versions[0]);
    const navigate = useNavigate();
    const encodedUrl = btoa(url);
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
                />
                <Button onClick={() => navigate(`/${version}/${encodedUrl}`)}>
                    <FontAwesomeIcon icon={faPlug} size="2x" />
                </Button>
            </Center>
        </Page>
    );
}
