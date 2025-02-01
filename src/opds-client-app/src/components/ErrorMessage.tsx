interface Props {
    readonly error: Error;
}

export function ErrorMessage({ error }: Props) {
    return <div>Error: {error.message}</div>;
}
