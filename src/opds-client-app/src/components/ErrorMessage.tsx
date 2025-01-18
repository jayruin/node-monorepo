interface Props {
    error: Error;
}

export function ErrorMessage(props: Props) {
    return <div>Error: {props.error.message}</div>;
}
