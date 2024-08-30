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
  onScreenChange?: (index: number) => void
}

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 50,
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
        onScreenChange?.(index)
      }
    },
    [])

    return (
      <View style={{ flex: 1 }}>
        <FlashList
          ref={ref}
          showsHorizontalScrollIndicator={false}
          viewabilityConfig={viewabilityConfig}
          data={data}
          onViewableItemsChanged={handleViewChange}
          pagingEnabled
          keyExtractor={(item, index) => String(index)}
          estimatedItemSize={width}
          renderItem={props => (
            <View style={{ width, height: '100%' }}>
              {externalRenderItem!(props)}
            </View>
          )}
          horizontal
          initialScrollIndex={initialScrollIndex}
          {...rest}
        />
      </View>
    )
  }
)

export default HorizontalScreenList
