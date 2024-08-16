import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { BodyMediumLabel, colors, Icon } from 'designSystem'

type Props = {
  selection: string
  hideRemove?: boolean
  onRemove?: (option: string) => void
}

const SelectedLabel: React.FC<Props> = ({
  selection,
  hideRemove,
  onRemove,
}) => (
  <View
    style={{
      borderWidth: 1,
      borderColor: colors.primary,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 8,
      gap: 8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <BodyMediumLabel style={{ color: colors.primary }}>
      {selection}
    </BodyMediumLabel>
    {!hideRemove && (
      <TouchableOpacity onPress={() => onRemove?.(selection)}>
        <Icon
          icon="close"
          size="small"
        />
      </TouchableOpacity>
    )}
  </View>
)

export default SelectedLabel
