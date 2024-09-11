import React, { ReactNode, useRef, useState } from 'react'
import { FlatList, Keyboard, ListRenderItemInfo, View } from 'react-native'

import TabHeaderPanel from './TabHeaderPanel'
import { TabConfig, TabStyles } from './types'
import HorizontalScreenList, {
  HorizontalScreenListProps,
} from '../HorizontalScreenList'

type Props = {
  style?: TabStyles
  tabsConfig: TabConfig<any>[]
  defaultIndex?: number
  children?: ReactNode
  onTabChange?: (name: string) => void
  keyboardDismissOnScroll?: boolean
  screenlistProps?: Partial<HorizontalScreenListProps>
}
const SwipeTabs: React.FC<Props> = ({
  style,
  tabsConfig,
  defaultIndex,
  children,
  onTabChange,
  keyboardDismissOnScroll,
  screenlistProps,
}) => {
  const tabsList = useRef<FlatList>(null)
  const [currentIndex, setCurrentIndex] = useState(defaultIndex || 0)

  const onTabPress = (index: number) => {
    if (keyboardDismissOnScroll) Keyboard.dismiss()

    setCurrentIndex(index)
    tabsList.current?.scrollToIndex({ index })
  }

  const onScreenChange = (index: number) => {
    setCurrentIndex(index)
    const tab = tabsConfig[index].name
    onTabChange?.(tab)
  }

  const renderItem = ({
    item: { component: Component, props = {} },
    index,
  }: ListRenderItemInfo<TabConfig<any>>) => (
    <Component
      {...props}
      key={index}
    />
  )

  return (
    <View style={{ flex: 1 }}>
      <TabHeaderPanel
        style={style?.header}
        tabsConfig={tabsConfig}
        currentIndex={currentIndex}
        onHeaderPress={onTabPress}
      />
      {children}
      <HorizontalScreenList
        ref={tabsList}
        onScreenChange={onScreenChange}
        data={tabsConfig}
        renderItem={renderItem}
        initialScrollIndex={defaultIndex}
        {...screenlistProps}
      />
    </View>
  )
}

export default SwipeTabs
