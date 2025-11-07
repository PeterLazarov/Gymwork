import { AppColors, fontSize as fontSizeToken, spacing, Text, useColors } from "@/designSystem"
import { useMemo } from "react"
import { StyleSheet, View } from "react-native"

type Props = {
  value?: string | number
  unit?: string
  isFocused?: boolean
  fontSize?: keyof typeof fontSizeToken
  fixDecimals?: boolean
}

export const SetDataLabel: React.FC<Props> = ({
  value,
  unit,
  isFocused,
  fontSize,
  fixDecimals,
}) => {
  const colors = useColors()
  const styles = useMemo(
    () => makeStyles(colors, isFocused, fontSize),
    [colors, isFocused, fontSize],
  )

  return (
    <View style={styles.container}>
      <Text style={styles.value}>
        {typeof value === "number" && fixDecimals ? value.toFixed(2) : value}
      </Text>
      {unit && <Text style={styles.unit}>{unit}</Text>}
    </View>
  )
}

const makeStyles = (
  colors: AppColors,
  isFocused?: boolean,
  fontSize?: keyof typeof fontSizeToken,
) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: spacing.xxs,
      justifyContent: "center",
      minWidth: spacing.xxl,
    },
    value: {
      fontWeight: "bold",
      color: isFocused ? colors.tertiary : colors.onSurface,
      fontSize: fontSize ? fontSizeToken[fontSize] : fontSizeToken.xs,
    },
    unit: {
      color: isFocused ? colors.tertiary : colors.onSurface,
      fontSize: fontSize ? fontSizeToken[fontSize] : fontSizeToken.xs,
    },
  })
