import { Pressable } from 'react-native'
import { useColors } from './tokens'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

export type BackdropProps = {
  onPress(): void
}

const Backdrop: React.FC<BackdropProps> = ({ onPress }) => {
  const colors = useColors()

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: colors.scrim,
          opacity: 0.2,
        }}
        onPress={onPress}
      />
    </Animated.View>
  )
}

export default Backdrop
