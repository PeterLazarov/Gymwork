import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Platform, View } from 'react-native'
import { IconButton } from 'react-native-paper'

import { Icon, iconSizes, BodyMediumLabel, colors } from 'designSystem'

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
        justifyContent: 'space-around',
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: sadSelected ? colors.white : 'transparent',
          borderRadius: 8,
          paddingBottom: 8,
        }}
      >
        <IconButton
          size={iconSizes.xLarge}
          onPress={() => onPress('sad')}
          icon={() => (
            <Icon
              icon="emoji-sad"
              size="large"
              color={sadSelected ? colors.red : colors.lightred}
            />
          )}
        />
        <BodyMediumLabel
          style={{
            color: sadSelected ? colors.red : colors.lightred,
            fontWeight: Platform.OS === 'ios' ? 700 : 'bold',
          }}
        >
          Bad
        </BodyMediumLabel>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: neutralSelected ? colors.white : 'transparent',
          borderRadius: 8,
          paddingBottom: 8,
        }}
      >
        <IconButton
          size={iconSizes.xLarge}
          onPress={() => onPress('neutral')}
          icon={() => (
            <Icon
              icon="emoji-neutral"
              size="large"
              color={neutralSelected ? colors.yellow : colors.lightyellow}
            />
          )}
        />
        <BodyMediumLabel
          style={{
            color: neutralSelected ? colors.yellow : colors.lightyellow,
            fontWeight: Platform.OS === 'ios' ? 700 : 'bold',
          }}
        >
          Normal
        </BodyMediumLabel>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: happySelected ? colors.white : 'transparent',
          borderRadius: 8,
          paddingBottom: 8,
        }}
      >
        <IconButton
          size={iconSizes.xLarge}
          onPress={() => onPress('happy')}
          icon={() => (
            <Icon
              icon="emoji-happy"
              size="large"
              color={happySelected ? colors.green : colors.lightgreen}
            />
          )}
        />
        <BodyMediumLabel
          style={{
            color: happySelected ? colors.green : colors.lightgreen,
            fontWeight: Platform.OS === 'ios' ? 700 : 'bold',
          }}
        >
          Good
        </BodyMediumLabel>
      </View>
    </View>
  )
}

export default observer(FeedbackPicker)
