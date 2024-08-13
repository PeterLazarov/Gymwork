import { FunctionComponent } from 'react'
import { TextStyle, ViewStyle } from 'react-native'

export type TabStyles = {
  headerPanelContainer?: ViewStyle
  header?: {
    label?: TextStyle
    activeLabel?: TextStyle
    activeIndicatorBorder?: ViewStyle
  }
}

export type TabConfig = {
  label: string
  name: string
  component: FunctionComponent<any>
  props?: object
}
