import { useEffect, useRef } from 'react'
import { StyleProp, View, ViewStyle, Animated } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { $styles } from 'designSystem'

import {
  $inputOuterBase,
  BaseToggleInputProps,
  ToggleProps,
  Toggle,
} from './Toggle'

export interface RadioToggleProps
  extends Omit<ToggleProps<RadioInputProps>, 'ToggleInput'> {
  /**
   * Optional style prop that affects the dot View.
   */
  inputDetailStyle?: ViewStyle
}

interface RadioInputProps extends BaseToggleInputProps<RadioToggleProps> {}

/**
 * @param {RadioToggleProps} props - The props for the `Radio` component.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Radio}
 * @returns {JSX.Element} The rendered `Radio` component.
 */
export function Radio(props: RadioToggleProps) {
  return (
    <Toggle
      accessibilityRole="radio"
      {...props}
      ToggleInput={RadioInput}
    />
  )
}

function RadioInput(props: RadioInputProps) {
  const {
    on,
    status,
    disabled,
    outerStyle: $outerStyleOverride,
    innerStyle: $innerStyleOverride,
    detailStyle: $detailStyleOverride,
  } = props

  const {
    theme: { colors },
  } = useAppTheme()

  const opacity = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(opacity.current, {
      toValue: on ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [on])

  const offBackgroundColor = [
    disabled && colors.outlineVariant,
    status === 'error' && colors.onError,
    colors.background,
  ].filter(Boolean)[0]

  const outerBorderColor = [
    disabled && colors.outlineVariant,
    status === 'error' && colors.error,
    !on && colors.outline,
    colors.outline,
  ].filter(Boolean)[0]

  const onBackgroundColor = [
    disabled && 'transparent',
    status === 'error' && colors.onError,
    colors.background,
  ].filter(Boolean)[0]

  const dotBackgroundColor = [
    disabled && colors.outlineVariant,
    status === 'error' && colors.error,
    colors.outline,
  ].filter(Boolean)[0]

  return (
    <View
      style={[
        $inputOuter,
        { backgroundColor: offBackgroundColor, borderColor: outerBorderColor },
        $outerStyleOverride,
      ]}
    >
      <Animated.View
        style={[
          $styles.toggleInner,
          { backgroundColor: onBackgroundColor },
          $innerStyleOverride,
          { opacity: opacity.current },
        ]}
      >
        <View
          style={[
            $radioDetail,
            { backgroundColor: dotBackgroundColor },
            $detailStyleOverride,
          ]}
        />
      </Animated.View>
    </View>
  )
}

const $radioDetail: ViewStyle = {
  width: 12,
  height: 12,
  borderRadius: 6,
}

const $inputOuter: StyleProp<ViewStyle> = [
  $inputOuterBase,
  { borderRadius: 12 },
]
