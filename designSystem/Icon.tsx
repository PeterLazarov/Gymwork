import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

export const iconSizes = {
  small: 1, //12
  default: 24,
  large: 36,
  xLarge: 48,
}

const IoniconsIcons = [
  'analytics',
  'chevron-back',
  'chevron-forward',
  'add',
  'remove',
  'close',
  'ellipsis-vertical',
  'md-calendar-sharp',
  'logo-react',
  'trophy',
  'chatbox-ellipses',
  'copy-outline',
  'pencil',
  'checkmark',
  'pause-outline',
  'stop',
  'play',
  'settings-outline',
] as const
type IonicIcon = (typeof IoniconsIcons)[number]

const MCIcons = ['yoga', 'weight-lifter'] as const
type MCIcon = (typeof MCIcons)[number]

const EntypoIcons = [
  'emoji-happy',
  'emoji-neutral',
  'emoji-sad',
  'stopwatch',
] as const
type EntypoIcon = (typeof EntypoIcons)[number]

// todo: get typing of all ant design icons
type Props = {
  icon: IonicIcon | MCIcon | EntypoIcon
  size?: keyof typeof iconSizes
  color?: string
}

export const Icon: React.FC<Props> = ({
  icon,
  size = 'default',
  color = 'black',
}) => {
  return (
    <>
      {IoniconsIcons.includes(icon) && (
        <Ionicons
          name={icon as IonicIcon}
          size={iconSizes[size]}
          color={color}
        />
      )}
      {MCIcons.includes(icon) && (
        <MaterialCommunityIcons
          name={icon as MCIcon}
          size={iconSizes[size]}
          color={color}
        />
      )}
      {EntypoIcons.includes(icon) && (
        <Entypo
          name={icon as EntypoIcon}
          size={iconSizes[size]}
          color={color}
        />
      )}
    </>
  )
}
