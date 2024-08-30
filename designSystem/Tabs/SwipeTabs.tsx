import React, { ReactNode, useRef, useState } from 'react'
import { Keyboard, View } from 'react-native'

import TabHeaderPanel from './TabHeaderPanel'
import { TabConfig, TabStyles } from './types'
import HorizontalScreenList from '../HorizontalScreenList'
import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo,
} from '@shopify/flash-list'

type Props = {
  style?: TabStyles
  tabsConfig: TabConfig[]
  initialScrollIndex?: number
  children?: ReactNode
  onTabChange?: (name: string) => void
  keyboardDismissOnScroll?: boolean
  flashlistProps?: Partial<FlashListProps<TabConfig>>
  headerSize?: 'md' | 'lg'
}
const SwipeTabs: React.FC<Props> = ({
  style,
  tabsConfig,
  initialScrollIndex,
  children,
  onTabChange,
  keyboardDismissOnScroll,
  flashlistProps,
  headerSize = 'md',
}) => {
  const flashList = useRef<FlashList<TabConfig>>(null)
  const [currentIndex, setCurrentIndex] = useState(initialScrollIndex || 0)

  const onTabPress = (index: number) => {
    if (keyboardDismissOnScroll) Keyboard.dismiss()

    flashList.current?.scrollToIndex({ index })
  }

  const onScreenChange = (index: number) => {
    setCurrentIndex(index)
    const tab = tabsConfig[index].name
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
      <TabHeaderPanel
        style={style?.header}
        tabsConfig={tabsConfig}
        currentIndex={currentIndex}
        onHeaderPress={onTabPress}
        headerSize={headerSize}
      />
      {children}
      <HorizontalScreenList
        ref={flashList}
        onScreenChange={onScreenChange}
        data={tabsConfig}
        renderItem={renderItem}
        initialScrollIndex={initialScrollIndex}
        {...flashlistProps}
      />
    </View>
  )
}

export default SwipeTabs
