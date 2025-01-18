import { fetchOpdsV1_2FeedData } from "./data/fetchers";
import ConnectPage from "./pages/ConnectPage";
import { FeedEntryPage } from "./pages/FeedEntryPage";
import { FeedPage } from "./pages/FeedPage";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

const queryClient = new QueryClient();

export default function App() {
    return (
        <MantineProvider defaultColorScheme="auto">
            <QueryClientProvider client={queryClient}>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<ConnectPage />} />
                        <Route
                            path="/v1.2/:url"
                            element={
                                <FeedPage
                                    fetchFeedData={fetchOpdsV1_2FeedData}
                                />
                            }
                        />
                        <Route
                            path="/entry/:dataString"
                            element={<FeedEntryPage />}
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </HashRouter>
            </QueryClientProvider>
        </MantineProvider>
    );
}
