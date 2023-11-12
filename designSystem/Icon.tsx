import { Ionicons } from '@expo/vector-icons'

const iconSizes = {
  small: 1, //12
  default: 24,
  large: 100, //36
}

// todo: get typing of all ant design icons
type Props = {
  icon:
    | 'analytics'
    | 'chevron-back'
    | 'chevron-forward'
    | 'add'
    | 'remove'
    | 'close'
    | 'ellipsis-vertical'
    | 'md-calendar-sharp'
    | 'logo-react'
    | 'trophy'
    | 'chatbox-ellipses'
  size?: keyof typeof iconSizes
  color?: string
}

export const Icon: React.FC<Props> = ({
  icon,
  size = 'default',
  color = 'black',
}) => {
  return (
    <Ionicons
      name={icon}
      size={iconSizes[size]}
      color={color}
    />
  )
}
