import { PropsWithChildren, useEffect } from "react";

interface Props {
    readonly title: string;
}

export function Page({ title, children }: PropsWithChildren<Props>) {
    useEffect(() => {
        document.title = title;
    }, []);
    return <>{children}</>;
}
