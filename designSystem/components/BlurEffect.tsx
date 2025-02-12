import { LinearGradient } from 'expo-linear-gradient'
import { Platform, View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'

export type BlurEffectProps = {
  height: number
  position: 'top' | 'bottom'
}

const BlurEffect: React.FC<BlurEffectProps> = ({ height, position }) => {
  const {
    theme: { colors },
  } = useAppTheme()

  const startY = Platform.OS === 'android' ? 0 : -1

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 2,
        overflow: 'hidden',
        height,
        top: position === 'top' ? 0 : undefined,
        bottom: position === 'bottom' ? 0 : undefined,
      }}
    >
      {/* Gradient Layer */}
      <LinearGradient
        colors={[colors.surfaceContainerHigh, 'transparent']}
        style={{
          height: 20 * height,
          flex: 1,
          transform:
            position === 'bottom'
              ? [
                  {
                    rotate: '180deg',
                  },
                ]
              : undefined,
        }}
        start={{ x: 0, y: startY }}
        end={{ x: 0, y: 0.5 }}
      />
    </View>
  )
}

export default BlurEffect
