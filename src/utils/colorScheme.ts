import { ColorSchemeName } from "react-native"

export type SupportedColorScheme = "light" | "dark"

export function resolveColorScheme(
  colorScheme: ColorSchemeName | undefined | null,
): SupportedColorScheme {
  return colorScheme === "dark" ? "dark" : "light"
}

export function toPersistedColorScheme(
  colorScheme: ColorSchemeName | undefined | null,
): SupportedColorScheme | null {
  if (colorScheme === "light" || colorScheme === "dark") {
    return colorScheme
  }

  return null
}
