import React from "react"
import { Dimensions, Pressable, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { boxShadows, fontSize, spacing, useColors } from "../tokens"
import { Modal } from "./Modal"
import { Text } from "./Text"

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
  // const insets = useSafeAreaInsets()

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
        open={visible}
        onClose={onDismiss}
      >
        {(() => {
          const screenWidth = Dimensions.get("window").width
          const top = (anchorRect?.y ?? 0) + spacing.xs
          // const top = (anchorRect ? anchorRect.y + anchorRect.height : 0) + spacing.xs + insets.top
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
                gap: spacing.xxs,
                minWidth: 180,
                ...boxShadows.lg,
              }}
            >
              {children}
            </View>
          )
        })()}
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
        style={{ color: colors.onSurface, fontSize: fontSize.md }}
        numberOfLines={1}
      >
        {title}
      </Text>
    </Pressable>
  )
}

Menu.Item = MenuItem
