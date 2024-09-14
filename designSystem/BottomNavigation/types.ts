import { IconProps } from '../Icon'

export type Item = {
  text: string
  routes: string[]
  icon: IconProps['icon']
  onPress: () => void
}
