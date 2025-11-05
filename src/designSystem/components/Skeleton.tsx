import { DimensionValue, View, ViewProps } from "react-native"

import { spacing, useColors } from "../tokens"

type SkeletonProps = ViewProps & {
  height?: number
  width?: DimensionValue
  borderRadius?: number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  height = spacing.md,
  width = "100%",
  borderRadius = spacing.xs,
  style,
  ...otherProps
}) => {
  const colors = useColors()

  return (
    <View
      style={[
        {
          backgroundColor: colors.surfaceContainerHigh,
          borderRadius,
          height,
          width,
        },
        style,
      ]}
      {...otherProps}
    />
  )
}

Skeleton.displayName = "Skeleton"
