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

    const renderItem = (props: any) => (
      <View style={{ width, flex: 1 }}>{externalRenderItem!(props)}</View>
    )
    console.log({ width })
    console.log({ data })
    return (
      <View style={{ height: width, width, backgroundColor: 'lightgreen' }}>
        {data && data.length > 0 && (
          <FlashList
            ref={ref}
            contentContainerStyle={{ backgroundColor: 'red' }}
            // showsHorizontalScrollIndicator={false}
            viewabilityConfig={viewabilityConfig}
            // onViewableItemsChanged={handleViewChange}
            // pagingEnabled
            keyExtractor={(item, index) => String(index)}
            estimatedItemSize={width}
            renderItem={renderItem}
            horizontal
            // snapToAlignment="center"
            // initialScrollIndex={initialScrollIndex}
            {...rest}
          />
        )}
      </View>
    )
  }
)

export default HorizontalScreenList
