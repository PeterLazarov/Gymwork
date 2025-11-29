import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { Platform, View, StyleSheet } from "react-native"

import { useColors } from "../tokens/colors"

type ScrollIndicatorProps = {
  height?: number
  position: "top" | "bottom"
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ height = 30, position }) => {
  const colors = useColors()

  const startY = Platform.OS === "android" ? 0 : -1

  const styles = makeStyles(position, height)

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.surfaceContainerHigh, "transparent"]}
        style={styles.gradient}
        start={{ x: 0, y: startY }}
        end={{ x: 0, y: 0.5 }}
      />
    </View>
  )
}

const makeStyles = (position: "top" | "bottom", height: number) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      left: 0,
      right: 0,
      zIndex: 2,
      overflow: "hidden",
      height,
      top: position === "top" ? 0 : undefined,
      bottom: position === "bottom" ? 0 : undefined,
    },
    gradient: {
      height: 20 * height,
      flex: 1,
      transform: position === "bottom" ? [{ rotate: "180deg" }] : undefined,
    },
  })