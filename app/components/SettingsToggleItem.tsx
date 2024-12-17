import { ToggleSwitch, useColors, Text, spacing } from 'designSystem'
import { useMemo } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'

export type SettingsToggledItemProps = {
  enabled: boolean
  onToggle?: () => void
  children?: React.ReactNode
}

// TODO utilize in settings screen
export default function SettingsToggleItem({
  enabled,
  onToggle,
  children,
}: SettingsToggledItemProps) {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onToggle}
    >
      <>
        <Text style={styles.itemLabel}>{children}</Text>
        <ToggleSwitch
          variant="primary"
          value={enabled}
          onValueChange={onToggle}
        />
      </>
    </TouchableOpacity>
  )
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    item: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.xs,
      height: 64,
      justifyContent: 'space-between',
      padding: spacing.sm,
    },
    itemLabel: {
      color: colors.onSurface,
    },
  })
