import { AntDesign } from '@expo/vector-icons'

const iconSizes = {
  small: 1,
  default: 24,
  large: 100,
}

// todo: get typing of all ant design icons
type Props = {
  icon: 'left' | 'right' | 'plus' | 'minus' | 'close'
  size?: keyof typeof iconSizes
  color?: string
}

export const Icon: React.FC<Props> = ({
  icon,
  size = 'default',
  color = 'black',
}) => {
  return (
    <AntDesign
      name={icon}
      size={iconSizes[size]}
      color={color}
    />
  )
}
