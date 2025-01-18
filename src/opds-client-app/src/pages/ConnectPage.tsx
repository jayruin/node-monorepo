import pageStyles from "../styles/page.module.css";
import { faPlug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput, Center, Button } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ConnectPage() {
    const [url, setUrl] = useState("");
    const navigate = useNavigate();
    const encodedUrl = btoa(url);
    return (
        <Center className={pageStyles["page-100vh"]}>
            <TextInput
                value={url}
                onChange={(event) => setUrl(event.currentTarget.value)}
            />
            <Button onClick={() => navigate(`/v1.2/${encodedUrl}`)}>
                <FontAwesomeIcon icon={faPlug} size="2x" />
            </Button>
        </Center>
    );
}
