import { FeedEntryImage } from "../components/FeedEntryImage";
import { base64Decode, getAcquisitionLinks } from "../data/feed";
import iconStyles from "../styles/icon.module.css";
import pageStyles from "../styles/page.module.css";
import {
    faClock,
    faCopyright,
    faDownload,
    faFile,
    faFingerprint,
    faLanguage,
    faTag,
    faUser,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Group, NavLink, Stack, Text, Title } from "@mantine/core";
import DOMPurify from "dompurify";
import { Navigate, useParams } from "react-router-dom";

export function FeedEntryPage() {
    const params = useParams();
    const dataString = params.dataString;
    if (!dataString) {
        return <Navigate to="/" />;
    }
    const data = base64Decode(dataString);
    if (!data) {
        return <div>Could not parse data string.</div>;
    }
    const acquisitionLinks = getAcquisitionLinks(data);
    return (
        <Group align="stretch">
            <Stack className={pageStyles["page-column"]}>
                <FeedEntryImage
                    data={data}
                    fallback={
                        <FontAwesomeIcon
                            icon={faFile}
                            className={iconStyles.icon}
                        />
                    }
                />
                {acquisitionLinks.map((l) => (
                    <NavLink
                        key={l.href}
                        href={l.href}
                        label={l.type}
                        leftSection={<FontAwesomeIcon icon={faDownload} />}
                    />
                ))}
                <Text ta="center">{data.id}</Text>
                <Text ta="center">{data.updated}</Text>
            </Stack>
            <Stack className={pageStyles["page-column"]}>
                <Title order={1}>{data.title}</Title>
                {data.identifier ? (
                    <Group>
                        <FontAwesomeIcon icon={faFingerprint} />
                        <Text>{data.identifier}</Text>
                    </Group>
                ) : undefined}
                {data.language ? (
                    <Group>
                        <FontAwesomeIcon icon={faLanguage} />
                        <Text>{data.language}</Text>
                    </Group>
                ) : undefined}
                {data.authors?.map((a) => (
                    <Group key={`author ${a}`}>
                        <FontAwesomeIcon icon={faUser} />
                        <Text>{a}</Text>
                    </Group>
                ))}
                {data.contributors?.map((c) => (
                    <Group key={`contributor ${c}`}>
                        <FontAwesomeIcon icon={faUsers} />
                        <Text>{c}</Text>
                    </Group>
                ))}
                {data.published ? (
                    <Group>
                        <FontAwesomeIcon icon={faClock} />
                        <Text>{data.published}</Text>
                    </Group>
                ) : undefined}
                {data.rights ? (
                    <Group>
                        <FontAwesomeIcon icon={faCopyright} />
                        <Text>{data.rights}</Text>
                    </Group>
                ) : undefined}
                {data.subjects?.map((s) => (
                    <Group key={`subject ${s}`}>
                        <FontAwesomeIcon icon={faTag} />
                        <Text>{s}</Text>
                    </Group>
                ))}
                {data.description ? (
                    <Container
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(data.description),
                        }}
                    ></Container>
                ) : undefined}
            </Stack>
        </Group>
    );
}
