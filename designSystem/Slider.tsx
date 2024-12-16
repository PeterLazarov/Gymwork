import React, { useState, useRef } from 'react'
import { View, PanResponder, LayoutChangeEvent } from 'react-native'
import MultiSlider, {
  MultiSliderProps,
} from '@ptomasroos/react-native-multi-slider'
import { useColors } from './tokens'
import { spacing } from 'designSystem'

type Props = Omit<MultiSliderProps, 'min' | 'max' | 'onValuesChange'> & {
  max: number
  min: number
  onValuesChange: NonNullable<MultiSliderProps['onValuesChange']>
}

const CustomSlider: React.FC<Props> = ({
  min,
  max,
  onValuesChange,
  selectedStyle,
  markerStyle,
  ...otherProps
}) => {
  const colors = useColors()

  const sliderRef = useRef(null)
  const [sliderWidth, setSliderWidth] = useState(0)

  // Calculate value based on the touch position
  const calculateValueFromTouch = (x: number) => {
    const newValue = Math.round((x / sliderWidth) * (max - min) + min)
    onValuesChange([newValue])
  }

  // Capture the layout of the slider
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    setSliderWidth(width)
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (event, gestureState) => {
      const { locationX } = event.nativeEvent
      calculateValueFromTouch(locationX)
    },
  })

  return (
    <View
      ref={sliderRef}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
      style={{ paddingHorizontal: spacing.xs }}
    >
      <MultiSlider
        onValuesChange={onValuesChange}
        selectedStyle={{
          backgroundColor: colors.primary,
          ...selectedStyle,
        }}
        markerStyle={{
          backgroundColor: colors.primary,
          ...markerStyle,
        }}
        {...otherProps}
      />
    </View>
  )
}

export default CustomSlider
