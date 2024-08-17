import { FlashList, FlashListProps } from '@shopify/flash-list'
import React, { forwardRef, useCallback } from 'react'
import {
  useWindowDimensions,
  View,
  ViewabilityConfig,
  ViewToken,
} from 'react-native'

type LockedProps = 'onScroll' | 'getItemLayout' | 'horizontal'

type Props = Omit<FlashListProps<any>, LockedProps> & {
  onScreenChange: (index: number) => void
}

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 100,
}

const HorizontalScreenList = forwardRef<FlashList<any>, Props>(
  (
    {
      onScreenChange,
      initialScrollIndex,
      renderItem: externalRenderItem,
      data,
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
        onScreenChange(index)
      }
    },
    [])

    console.log({ width })
    // console.log({ data })
    return (
      <View style={{ flex: 1, backgroundColor: 'lightgreen' }}>
        <FlashList
          ref={ref}
          contentContainerStyle={{ backgroundColor: 'red' }}
          // showsHorizontalScrollIndicator={true}
          viewabilityConfig={viewabilityConfig}
          data={data}
          onViewableItemsChanged={handleViewChange}
          pagingEnabled
          keyExtractor={(item, index) => String(index)}
          estimatedItemSize={width}
          renderItem={externalRenderItem}
          horizontal
          snapToAlignment="center"
          initialScrollIndex={initialScrollIndex}
          {...rest}
        />
      </View>
    )
  }
)

export default HorizontalScreenList
