import React, { ReactNode, useRef, useState } from 'react'
import {
  FlatList,
  Keyboard,
  FlatListProps,
  View,
  ListRenderItemInfo,
} from 'react-native'

import TabHeader from './TabHeaderPanel'
import { TabConfig, TabStyles } from './types'
import HorizontalScreenList from '../HorizontalScreenList'

type Props = {
  style?: TabStyles
  tabsConfig: TabConfig[]
  initialScrollIndex?: number
  children?: ReactNode
  onTabChange?: (name: string) => void
  keyboardDismissOnScroll?: boolean
  flatlistProps?: Partial<FlatListProps<any>>
}
const SwipeTabs: React.FC<Props> = ({
  style,
  tabsConfig,
  initialScrollIndex,
  children,
  onTabChange,
  keyboardDismissOnScroll,
  flatlistProps,
}) => {
  const flatList = useRef<FlatList<TabConfig>>(null)
  const [currentIndex, setCurrentIndex] = useState(initialScrollIndex || 0)

  const onTabPress = (index: number) => {
    if (keyboardDismissOnScroll) Keyboard.dismiss()

    flatList.current?.scrollToIndex({ index })
  }

  const onScreenChange = (index: number) => {
    setCurrentIndex(index)
    const tab = tabsConfig[index].label
    onTabChange?.(tab)
  }

  const renderItem = ({
    item: { component: Component, props = {} },
    index,
  }: ListRenderItemInfo<TabConfig>) => (
    <Component
      {...props}
      key={index}
    />
  )

  return (
    <View style={{ flex: 1 }}>
      <TabHeader
        style={style?.header}
        tabsConfig={tabsConfig}
        currentIndex={currentIndex}
        onHeaderPress={onTabPress}
      />
      {children}
      <HorizontalScreenList
        ref={flatList}
        onScreenChange={onScreenChange}
        data={tabsConfig}
        renderItem={renderItem}
        initialScrollIndex={initialScrollIndex}
        {...flatlistProps}
      />
    </View>
  )
}

export default SwipeTabs
