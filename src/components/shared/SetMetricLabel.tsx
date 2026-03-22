import { AppColors, fontSize as fontSizeToken, spacing, Text, useColors } from "@/designSystem"
import { useMemo } from "react"
import { StyleSheet } from "react-native"

type Props = {
  value?: string | number
  unit?: string
  isFocused?: boolean
  fontSize?: keyof typeof fontSizeToken
  fixDecimals?: boolean
  testID?: string
}

export const SetMetricLabel: React.FC<Props> = ({
  value,
  unit,
  isFocused,
  fontSize,
  fixDecimals,
  testID,
}) => {
  const colors = useColors()
  const styles = useMemo(
    () => makeStyles(colors, isFocused, fontSize),
    [colors, isFocused, fontSize],
  )
  const displayValue = typeof value === "number" && fixDecimals ? value.toFixed(2) : value

  return (
    <Text
      testID={testID}
      style={styles.container}
    >
      <Text style={styles.value}>{displayValue}</Text>
      {unit && <Text style={styles.unit}>{` ${unit}`}</Text>}
    </Text>
  )
}

const makeStyles = (
  colors: AppColors,
  isFocused?: boolean,
  fontSize?: keyof typeof fontSizeToken,
) =>
  StyleSheet.create({
    container: {
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
