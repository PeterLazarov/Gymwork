import React from "react"
import { Dimensions, Modal, Pressable, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { boxShadows, spacing, useColors } from "../tokens"
import { Text } from "./Text"
import { Backdrop } from "./Backdrop"

type MenuProps = {
  visible: boolean
  onDismiss: () => void
  anchor: React.ReactNode
  children: React.ReactNode
  position?: "bottom-right" | "bottom-left"
}

export const Menu: React.FC<MenuProps> & {
  Item: React.FC<MenuItemProps>
} = ({ visible, onDismiss, anchor, children, position = "bottom-right" }) => {
  const colors = useColors()

  const anchorRef = React.useRef<View>(null)
  const [anchorRect, setAnchorRect] = React.useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)

  React.useEffect(() => {
    if (!visible) {
      setAnchorRect(null)
      return
    }

    const measure = () => {
      anchorRef.current?.measureInWindow((x, y, width, height) => {
        setAnchorRect({ x, y, width, height })
      })
    }

    const id = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(id)
  }, [visible])

  return (
    <>
      <View
        ref={anchorRef}
        collapsable={false}
      >
        {anchor}
      </View>

      <Modal
        transparent
        visible={visible}
        onRequestClose={onDismiss}
        animationType="fade"
      >
        <Backdrop onPress={onDismiss} />
        <View
          pointerEvents="box-none"
          style={{ flex: 1 }}
        >
          {(() => {
            const screenWidth = Dimensions.get("window").width
            const top = (anchorRect ? anchorRect.y + anchorRect.height : 0) + spacing.xs
            const right = anchorRect
              ? Math.max(spacing.sm, screenWidth - (anchorRect.x + anchorRect.width))
              : spacing.sm
            const left = anchorRect ? Math.max(spacing.sm, anchorRect.x) : spacing.sm

            const panelPositionStyle = position === "bottom-right" ? { top, right } : { top, left }

            return (
              <View
                style={{
                  position: "absolute",
                  ...panelPositionStyle,
                  backgroundColor: colors.surface,
                  borderRadius: spacing.xxs,
                  paddingVertical: spacing.xs,
                  minWidth: 180,
                  ...boxShadows.lg,
                }}
              >
                {children}
              </View>
            )
          })()}
        </View>
      </Modal>
    </>
  )
}

type MenuItemProps = {
  title: string
  onPress: () => void
  disabled?: boolean
}

const MenuItem: React.FC<MenuItemProps> = ({ title, onPress, disabled }) => {
  const colors = useColors()

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.5 : 1,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
      }}
    >
      <Text
        style={{ color: colors.onSurface }}
        numberOfLines={1}
      >
        {title}
      </Text>
    </Pressable>
  )
}

Menu.Item = MenuItem
