import {
  Entypo,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
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
  'calendar-sharp',
  'trophy',
  'chatbox-ellipses',
  'chatbox-ellipses-outline',
  'copy-outline',
  'checkmark',
  'pause-outline',
  'stop',
  'play',
  'play-forward-outline',
  'settings-outline',
  'refresh-outline',
  'download-outline',
  'warning-outline',
  'battery-dead',
  'battery-half',
  'battery-full',
  'star-outline',
  'star',
  'flame',
] as const satisfies readonly (keyof typeof Ionicons.glyphMap)[]
type IonicIcon = (typeof IoniconsIcons)[number]

const MCIcons = [
  'yoga',
  'drag-horizontal-variant',
  'delete',
  'pencil',
  'dumbbell',
  'clipboard-plus-outline',
  'history',
  'alert-decagram-outline',
  'speedometer-slow',
  'speedometer-medium',
  'speedometer',
  'sleep',
] as const satisfies readonly (keyof typeof MaterialCommunityIcons.glyphMap)[]
type MCIcon = (typeof MCIcons)[number]

const EntypoIcons = [
  'emoji-happy',
  'emoji-neutral',
  'emoji-sad',
  'stopwatch',
  'heart',
  'heart-outlined',
  'check',
] as const satisfies readonly (keyof typeof Entypo.glyphMap)[]
type EntypoIcon = (typeof EntypoIcons)[number]

const FontAwesome6Icons = [
  'grin-stars',
] as const satisfies readonly (keyof typeof FontAwesome6.glyphMap)[]
type FontAwesome6Icon = (typeof FontAwesome6)[number]

// todo: get typing of all ant design icons
export type IconProps = {
  icon: IonicIcon | MCIcon | EntypoIcon | FontAwesome6Icon
  size?: keyof typeof iconSizes
  color?: string
  style?: StyleProp<TextStyle>
}

export const Icon: React.FC<IconProps> = ({
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
      {FontAwesome6Icons.includes(icon) && (
        <FontAwesome6
          name={icon as FontAwesome6Icon}
          size={iconSizes[size]}
          color={color}
          style={style}
        />
      )}
    </>
  )
}
