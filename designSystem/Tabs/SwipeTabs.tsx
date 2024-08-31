import React, { ReactNode, useRef, useState } from 'react'
import { FlatListProps, Keyboard, ListRenderItemInfo, View } from 'react-native'
import type { ICarouselInstance } from 'react-native-reanimated-carousel'
import { CarouselRenderItem } from 'react-native-reanimated-carousel'

import TabHeaderPanel from './TabHeaderPanel'
import { TabConfig, TabStyles } from './types'
import HorizontalScreenList, {
  HorizontalScreenListProps,
} from '../HorizontalScreenList'

type Props = {
  style?: TabStyles
  tabsConfig: TabConfig[]
  defaultIndex?: number
  children?: ReactNode
  onTabChange?: (name: string) => void
  keyboardDismissOnScroll?: boolean
  screenlistProps?: Partial<HorizontalScreenListProps>
  headerSize?: 'md' | 'lg'
}
const SwipeTabs: React.FC<Props> = ({
  style,
  tabsConfig,
  defaultIndex,
  children,
  onTabChange,
  keyboardDismissOnScroll,
  screenlistProps,
  headerSize = 'md',
}) => {
  const tabsList = useRef<ICarouselInstance>(null)
  const [currentIndex, setCurrentIndex] = useState(defaultIndex || 0)

  const onTabPress = (index: number) => {
    if (keyboardDismissOnScroll) Keyboard.dismiss()

    tabsList.current?.scrollTo({ index })
  }

  const onScreenChange = (index: number) => {
    setCurrentIndex(index)
    const tab = tabsConfig[index].name
    onTabChange?.(tab)
  }

  const renderItem: CarouselRenderItem<TabConfig> = ({
    item: { component: Component, props = {} },
    index,
  }) => (
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
        ref={tabsList}
        onScreenChange={onScreenChange}
        data={tabsConfig}
        renderItem={renderItem}
        defaultIndex={defaultIndex}
        {...screenlistProps}
      />
    </View>
  )
}

export default SwipeTabs
