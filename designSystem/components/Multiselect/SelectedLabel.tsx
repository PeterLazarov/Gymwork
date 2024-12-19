import { View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { Icon, IconButton, spacing, Text } from 'designSystem'

type Props = {
  selection: string
  hideRemove?: boolean
  onRemove?: (option: string) => void
}

const SelectedLabel: React.FC<Props> = ({
  selection,
  hideRemove,
  onRemove,
}) => {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.primary,
        paddingLeft: spacing.xs,
        paddingRight: spacing.xxs,
        paddingVertical: spacing.xs,
        borderRadius: 8,
        gap: spacing.xxs,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: colors.primary,
          textTransform: 'capitalize',
        }}
      >
        {selection}
      </Text>
      {!hideRemove && (
        <IconButton
          onPress={() => onRemove?.(selection)}
          size="sm"
        >
          <Icon
            icon="close"
            size="small"
          />
        </IconButton>
      )}
    </View>
  )
}

export default SelectedLabel
