import { View } from "react-native"
import { useColors } from "../tokens/colors"

type Props = {
  orientation: "horizontal" | "vertical"
  variant: "primary" | "accent" | "neutral"
}

export function Divider(props: Props) {
  const colors = useColors()

  const variants = {
    primary: colors.primary,
    accent: colors.tertiary,
    neutral: colors.outlineVariant,
  }

  return (
    <View
      style={{
        width: props.orientation === "horizontal" ? "100%" : 1,
        height: props.orientation === "horizontal" ? 1 : "100%",
        backgroundColor: variants[props.variant],
      }}
    ></View>
  )
}
