import { observer } from 'mobx-react-lite'
import React from 'react'

import { Text, Icon, useColors, fontSize, palettes } from 'designSystem'
import { TouchableOpacity } from 'react-native'

type Props = {
  completed: boolean
  //   symbol?: string
  //   color: string
  onPress: () => void
}
const SetCompletedButton: React.FC<Props> = ({
  completed,
  //   symbol,
  //   color,
  onPress,
}) => {
  const colors = useColors()

  return (
    <TouchableOpacity
      style={{
        height: 36,
        width: 36,
        borderColor: colors.outline,
        borderWidth: 1,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 4,
        borderBottomLeftRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={onPress}
    >
      <Icon
        color={completed ? palettes.green['60'] : colors.outline}
        icon="checkmark"
      ></Icon>
    </TouchableOpacity>
  )
}
export default observer(SetCompletedButton)
