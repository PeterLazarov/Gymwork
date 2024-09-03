import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Platform, View, Text } from 'react-native'

import { Icon, IconButton, colorSchemas, colors, fontSize } from 'designSystem'

type Props = {
  selected?: string
  onChange: (feeling: string) => void
}
const FeedbackPicker: React.FC<Props> = ({ selected, onChange }) => {
  const [selectedEmoji, setSelectedEmoji] = useState(selected || 'neutral')

  function onPress(feeling: string) {
    setSelectedEmoji(feeling)
    onChange(feeling)
  }

  const sadSelected = selectedEmoji === 'sad'
  const neutralSelected = selectedEmoji === 'neutral'
  const happySelected = selectedEmoji === 'happy'

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: sadSelected ? colors.white : 'transparent',
          borderRadius: 8,
          padding: 8,
        }}
      >
        <IconButton
          size="lg"
          onPress={() => onPress('sad')}
        >
          <Icon
            icon="emoji-sad"
            size="large"
            color={
              sadSelected ? colorSchemas.coral.default : colors.neutralDark
            }
          />
        </IconButton>
        <Text
          style={{
            fontSize: fontSize.sm,
            color: sadSelected
              ? colorSchemas.coral.default
              : colors.neutralDark,
            fontWeight: Platform.OS === 'ios' ? 700 : 'bold',
          }}
        >
          Bad
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: neutralSelected ? colors.white : 'transparent',
          borderRadius: 8,
          padding: 8,
        }}
      >
        <IconButton
          size="lg"
          onPress={() => onPress('neutral')}
        >
          <Icon
            icon="emoji-neutral"
            size="large"
            color={
              neutralSelected ? colorSchemas.amber.default : colors.neutralDark
            }
          />
        </IconButton>
        <Text
          style={{
            fontSize: fontSize.sm,
            color: neutralSelected
              ? colorSchemas.amber.default
              : colors.neutralDark,
            fontWeight: Platform.OS === 'ios' ? 700 : 'bold',
          }}
        >
          Normal
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: happySelected ? colors.white : 'transparent',
          borderRadius: 8,
          padding: 8,
        }}
      >
        <IconButton
          size="lg"
          onPress={() => onPress('happy')}
        >
          <Icon
            icon="emoji-happy"
            size="large"
            color={
              happySelected ? colorSchemas.green.default : colors.neutralDark
            }
          />
        </IconButton>
        <Text
          style={{
            fontSize: fontSize.sm,
            color: happySelected
              ? colorSchemas.green.default
              : colors.neutralDark,
            fontWeight: Platform.OS === 'ios' ? 700 : 'bold',
          }}
        >
          Good
        </Text>
      </View>
    </View>
  )
}

export default observer(FeedbackPicker)
