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

export type TabConfig<T extends object | undefined> = {
  label: string;
  name: string;
  component: T extends undefined ? FunctionComponent : FunctionComponent<T>;
  props?: T
}