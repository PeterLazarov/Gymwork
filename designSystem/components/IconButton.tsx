import {
  TouchableHighlightProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

const sizes = {
  sm: 24,
  md: 42,
  lg: 68,
}
export type IconButtonProps = Omit<TouchableHighlightProps, 'style'> & {
  style?: ViewStyle
  size?: keyof typeof sizes
}
const IconButton: React.FC<IconButtonProps> = ({
  style,
  size = 'md',
  ...props
}) => (
  <TouchableOpacity
    style={{
      flexGrow: 0,
      height: sizes[size],
      width: sizes[size],
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
    {...props}
  />
)

export default IconButton
