import React, { ReactNode, useRef, useState } from 'react'
import {
  useWindowDimensions,
  FlatList,
  Keyboard,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native'

import TabHeader from './TabHeaderPanel'
import { TabConfig, TabStyles } from './types'

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
  const width = useWindowDimensions().width

  const flatList = useRef<FlatList<TabConfig>>(null)
  const [currentIndex, setCurrentIndex] = useState(initialScrollIndex || 0)

  // Scroll to pressed button index
  const onButtonPress = (index: number) => {
    if (keyboardDismissOnScroll) Keyboard.dismiss()

    flatList.current?.scrollToIndex({ index })
  }

  const onFlatListScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (keyboardDismissOnScroll) Keyboard.dismiss()

    const index = Math.round(e.nativeEvent.contentOffset.x / width)
    if (index !== currentIndex) {
      setCurrentIndex(index)
      const tab = tabsConfig[index].label
      onTabChange?.(tab)
    }
  }

  const getItemLayout = (
    data: ArrayLike<TabConfig> | null | undefined,
    index: number
  ) => ({
    length: width,
    offset: width * index,
    index,
  })

  return (
    <View style={{ flex: 1 }}>
      <TabHeader
        style={style?.header}
        tabsConfig={tabsConfig}
        currentIndex={currentIndex}
        onHeaderPress={onButtonPress}
      />
      {children}
      <FlatList
        ref={flatList}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onFlatListScroll}
        pagingEnabled
        keyExtractor={(item, index) => String(index)}
        getItemLayout={getItemLayout}
        horizontal
        data={tabsConfig}
        renderItem={({ item: { component: Component, props = {} }, index }) => (
          <View
            style={{ width, flex: 1 }}
            key={index}
          >
            <Component {...props} />
          </View>
        )}
        snapToAlignment="center"
        style={{
          flex: 1,
        }}
        initialScrollIndex={initialScrollIndex}
        {...flatlistProps}
      />
    </View>
  )
}

export default SwipeTabs
