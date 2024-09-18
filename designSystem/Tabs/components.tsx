import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewProps,
  View,
  TextProps,
} from 'react-native'

import { Text, useColors } from '../'

export const TabHeaderTouchable: React.FC<TouchableOpacityProps> = ({
  style,
  ...otherProps
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          paddingLeft: 5,
          paddingRight: 5,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      {...otherProps}
    />
  )
}

type TabLabelProps = TextProps & {
  isActive: boolean
}
export const TabLabel: React.FC<TabLabelProps> = ({
  isActive,
  style,
  ...otherProps
}) => {
  const colors = useColors()
  return (
    <Text
      style={[
        {
          color: isActive ? colors.mat.onSurface : colors.mat.outlineVariant,
        },
        style,
      ]}
      {...otherProps}
    />
  )
}

export const ActiveIndicator: React.FC<ViewProps> = () => {
  const colors = useColors()
  return (
    <View
      style={{
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 2,
        borderColor: colors.mat.onSurface,
      }}
    />
  )
}
