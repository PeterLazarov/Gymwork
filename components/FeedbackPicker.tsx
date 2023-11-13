import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { View, Text } from 'react-native'
import { IconButton } from 'react-native-paper'

import { Icon, iconSizes } from '../designSystem'
import colors from '../designSystem/colors'

type Props = {
  onChange: (feeling: string) => void
}
const FeedbackPicker: React.FC<Props> = ({ onChange }) => {
  const [selectedEmoji, setSelectedEmoji] = useState('neutral')
  const unselectedOpacity = 0.3
  const unselectedTextOpacity = 0.6

  function onPress(feeling: string) {
    setSelectedEmoji(feeling)
    onChange(feeling)
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <IconButton
          size={iconSizes.large}
          onPress={() => onPress('sad')}
          style={{ opacity: selectedEmoji === 'sad' ? 1 : unselectedOpacity }}
          icon={() => (
            <Icon
              icon="emoji-sad"
              size="large"
              color={colors.red}
            />
          )}
        />
        <Text
          style={{
            color: colors.red,
            opacity: selectedEmoji === 'sad' ? 1 : unselectedTextOpacity,
          }}
        >
          Bad
        </Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <IconButton
          size={iconSizes.large}
          onPress={() => onPress('neutral')}
          style={{
            opacity: selectedEmoji === 'neutral' ? 1 : unselectedOpacity,
          }}
          icon={() => (
            <Icon
              icon="emoji-neutral"
              size="large"
              color={colors.yellow}
            />
          )}
        />
        <Text
          style={{
            color: colors.yellow,
            opacity: selectedEmoji === 'neutral' ? 1 : unselectedTextOpacity,
          }}
        >
          Normal
        </Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <IconButton
          size={iconSizes.large}
          onPress={() => onPress('happy')}
          style={{ opacity: selectedEmoji === 'happy' ? 1 : unselectedOpacity }}
          icon={() => (
            <Icon
              icon="emoji-happy"
              size="large"
              color={colors.green}
            />
          )}
        />
        <Text
          style={{
            color: colors.green,
            opacity: selectedEmoji === 'happy' ? 1 : unselectedTextOpacity,
          }}
        >
          Good
        </Text>
      </View>
    </View>
  )
}

export default observer(FeedbackPicker)
