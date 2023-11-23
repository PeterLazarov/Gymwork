import { FunctionComponent } from 'react'
import { ViewStyle } from 'react-native'

export type TabStyles = {
  headerPanelContainer?: ViewStyle
  header?: {
    button?: ViewStyle
    labelColor?: string
    activeLabelColor?: string
    activeIndicatorBorderColor?: string
  }
}

export type TabConfig = {
  label: string
  name: string
  component: FunctionComponent<any>
  props?: object
}
