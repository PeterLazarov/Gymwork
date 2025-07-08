import { PlatformColor, View, ViewStyle } from "react-native"
import { Button, ButtonVariant, Label, Section, ButtonProps } from "@expo/ui/swift-ui"

import { useAppTheme } from "@/theme/context"

export type ButtonIosProps = Omit<ButtonProps, "children"> & {
  height?: number
  centered?: boolean
  children?: string
  bg?: string
  style?: ViewStyle
  systemImageColor?: string
}

function getIconColor(btnVariant: ButtonVariant, appearance: "light" | "dark", disabled = false) {
  if (disabled) return PlatformColor("systemGray")

  switch (btnVariant) {
    case "default":
    case "bordered":
    case "borderless":
      return PlatformColor("systemBlue")
    case "plain":
      return appearance === "dark" ? PlatformColor("white") : PlatformColor("black")
    case "borderedProminent":
    default:
      return PlatformColor("white") // or a fallback color
  }
}

export function BigButtonIos(props: ButtonIosProps) {
  const { theme } = useAppTheme()

  const {
    centered = false,
    variant = "default",
    bg,
    height = 48,
    systemImage,
    systemImageColor = getIconColor(
      props.variant ?? "default",
      theme.isDark ? "dark" : "light",
      props.disabled,
    ),
    style,
    ...rest
  } = props

  return (
    <View style={[{ flexDirection: "column" }, style]}>
      <Button
        style={{
          height,
          overflow: "hidden",
        }}
        color={bg}
        variant={variant}
        {...rest}
      >
        {centered ? (
          //   @ts-ignore
          <Label color={systemImageColor} systemImage={systemImage} title={props.children} />
        ) : (
          <View
            style={{
              height: height - 16,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {/* @ts-ignore */}
            <Label color={systemImageColor} systemImage={systemImage} title={props.children} />
          </View>
        )}
      </Button>
    </View>
  )
}
