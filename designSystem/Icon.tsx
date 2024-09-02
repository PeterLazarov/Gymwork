import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleProp, TextStyle } from 'react-native'

const iconSizes = {
  small: 16,
  default: 25,
  large: 36,
  xLarge: 48,
}

const IoniconsIcons = [
  'analytics',
  'chevron-back',
  'chevron-forward',
  'chevron-down',
  'add',
  'remove',
  'close',
  'ellipsis-vertical',
  // 'md-calendar-sharp',
  'calendar-sharp',
  'trophy',
  'chatbox-ellipses',
  'chatbox-ellipses-outline',
  'copy-outline',
  'pencil',
  'checkmark',
  'pause-outline',
  'stop',
  'play',
  'settings-outline',
  'refresh-outline',
] as const satisfies readonly (keyof typeof Ionicons.glyphMap)[]
type IonicIcon = (typeof IoniconsIcons)[number]

const MCIcons = [
  'yoga',
  'drag-horizontal-variant',
  'delete',
] as const satisfies readonly (keyof typeof MaterialCommunityIcons.glyphMap)[]
type MCIcon = (typeof MCIcons)[number]

const EntypoIcons = [
  'emoji-happy',
  'emoji-neutral',
  'emoji-sad',
  'stopwatch',
  'heart',
  'heart-outlined',
] as const satisfies readonly (keyof typeof Entypo.glyphMap)[]
type EntypoIcon = (typeof EntypoIcons)[number]

// todo: get typing of all ant design icons
type Props = {
  icon: IonicIcon | MCIcon | EntypoIcon
  size?: keyof typeof iconSizes
  color?: string
  style?: StyleProp<TextStyle>
}

export const Icon: React.FC<Props> = ({
  icon,
  size = 'default',
  color = 'black',
  style,
}) => {
  return (
    <>
      {IoniconsIcons.includes(icon) && (
        <Ionicons
          name={icon as IonicIcon}
          size={iconSizes[size]}
          color={color}
          style={style}
        />
      )}
      {MCIcons.includes(icon) && (
        <MaterialCommunityIcons
          name={icon as MCIcon}
          size={iconSizes[size]}
          color={color}
          style={style}
        />
      )}
      {EntypoIcons.includes(icon) && (
        <Entypo
          name={icon as EntypoIcon}
          size={iconSizes[size]}
          color={color}
          style={style}
        />
      )}
    </>
  )
}
