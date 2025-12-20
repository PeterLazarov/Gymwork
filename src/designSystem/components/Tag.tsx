import { StyleSheet, StyleProp, ViewStyle } from "react-native"

import { fontSize, spacing } from "../tokens"
import { Button, ButtonProps } from "./Button"
import { Icon, IconProps } from "./Icon"
import { IconButton } from "./IconButton"

type TagProps =  Omit<ButtonProps, "size" | "children"> & {
    text?: string
    rightIcon?: IconProps['icon']
    rightIconAction?: () => void
  }
export const Tag: React.FC<TagProps> = ({ style, rightIcon, rightIconAction, ...props }) => {
  return (
    <Button
      style={[styles.tag, style, !!rightIcon ? {paddingRight: spacing.xxl} : undefined]}
      size="small"
      {...props}
    >
      {rightIcon && 
        <IconButton onPress={rightIconAction} style={styles.rightIcon}>
          <Icon icon={rightIcon}  />
        </IconButton>
      }
    </Button>
  )
}

const styles = StyleSheet.create({
  tag: {
    fontSize: fontSize.md,
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  rightIcon: {
    position: "absolute",
    right: 0,
  }
})
