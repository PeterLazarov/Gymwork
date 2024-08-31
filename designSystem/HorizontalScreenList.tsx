import * as React from 'react'
import type { ICarouselInstance } from 'react-native-reanimated-carousel'
import Carousel, { TCarouselProps } from 'react-native-reanimated-carousel'

import { View, useWindowDimensions } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { forwardRef } from 'react'

type LockedProps = 'width' | 'mode' | 'vertical' | 'modeConfig'
type Props = Omit<TCarouselProps, LockedProps> & {
  onScreenChange?: (index: number) => void
}

const HorizontalScreenList = forwardRef<ICarouselInstance, Props>(
  (
    {
      onScreenChange,
      defaultIndex = 0,
      renderItem: externalRenderItem,
      ...rest
    },
    ref
  ) => {
    const windowWidth = useWindowDimensions().width
    const scrollOffsetValue = useSharedValue<number>(0)

    return (
      <Carousel
        width={windowWidth}
        loop
        ref={ref}
        defaultScrollOffsetValue={scrollOffsetValue}
        style={{ flex: 1 }}
        defaultIndex={defaultIndex}
        pagingEnabled
        onSnapToItem={onScreenChange}
        renderItem={props => (
          <View style={{ width: windowWidth, flex: 1 }}>
            {externalRenderItem(props)}
          </View>
        )}
        {...rest}
      />
    )
  }
)

export default HorizontalScreenList
