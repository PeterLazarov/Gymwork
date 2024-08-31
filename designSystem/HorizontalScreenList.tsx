import React, { forwardRef, useCallback } from 'react'
import {
  useWindowDimensions,
  FlatList,
  FlatListProps,
  View,
  ViewabilityConfig,
  ViewToken,
} from 'react-native'

type LockedProps = 'onScroll' | 'getItemLayout' | 'horizontal'

type Props = Omit<FlatListProps<any>, LockedProps> & {
  onScreenChange?: (index: number) => void
}

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 100,
}

const HorizontalScreenList = forwardRef<FlatList<any>, Props>(
  (
    {
      onScreenChange,
      initialScrollIndex,
      renderItem: externalRenderItem,
      ...rest
    },
    ref
  ) => {
    const width = useWindowDimensions().width

    const handleViewChange = useCallback(function (info: {
      viewableItems: ViewToken[]
      changed: ViewToken[]
    }) {
      const index = info?.viewableItems[0]?.index
      if (typeof index === 'number' && index >= 0) {
        onScreenChange?.(index)
      }
    },
    [])

    const renderItem = (props: any) => (
      <View style={{ width, flex: 1 }}>{externalRenderItem!(props)}</View>
    )

    const getItemLayout = (
      data: ArrayLike<any> | null | undefined,
      index: number
    ) => ({
      length: width,
      offset: width * index,
      index,
    })

    return (
      <FlatList
        ref={ref}
        style={{
          flex: 1,
        }}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={handleViewChange}
        pagingEnabled
        keyExtractor={(item, index) => String(index)}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        horizontal
        snapToAlignment="center"
        initialScrollIndex={initialScrollIndex}
        {...rest}
      />
    )
  }
)

export default HorizontalScreenList
