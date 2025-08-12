import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Button,
    useComputedColorScheme,
    useMantineColorScheme,
} from "@mantine/core";

export function ToggleThemeButton() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme("light", {
        getInitialValueInEffect: true,
    });
    return (
        <Button
            onClick={() => {
                setColorScheme(
                    computedColorScheme === "light" ? "dark" : "light",
                );
            }}
            style={{
                color: "var(--mantine-color-text)",
                backgroundColor: "var(--mantine-color-body)",
                borderColor: "var(--mantine-color-default-border)",
                borderWidth: "1px",
                borderStyle: "solid",
            }}
        >
            <FontAwesomeIcon
                icon={computedColorScheme === "light" ? faSun : faMoon}
                size="2x"
            />
        </Button>
    );
}
