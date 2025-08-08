import { fetchOpdsV1_2FeedData, fetchOpdsV2_0FeedData } from "./data/fetchers";
import ConnectPage from "./pages/ConnectPage";
import { FeedEntryPage } from "./pages/FeedEntryPage";
import { FeedPage } from "./pages/FeedPage";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

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
                                    version="v1.2"
                                />
                            }
                        />
                        <Route
                            path="/v2.0/:url"
                            element={
                                <FeedPage
                                    fetchFeedData={fetchOpdsV2_0FeedData}
                                    version="v2.0"
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
