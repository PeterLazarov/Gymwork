import React, { useState, forwardRef } from 'react'
import {
  useWindowDimensions,
  FlatList,
  Keyboard,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native'

type LockedProps = 'onScroll' | 'getItemLayout' | 'horizontal'

type Props = Omit<FlatListProps<any>, LockedProps> & {
  onScreenChange: (index: number) => void
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
    const [currentIndex, setCurrentIndex] = useState(initialScrollIndex || 0)

    const onFlatListScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      Keyboard.dismiss()

      const index = Math.round(e.nativeEvent.contentOffset.x / width)
      if (index !== currentIndex) {
        setCurrentIndex(index)
        onScreenChange(index)
      }
    }

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
        scrollEventThrottle={16}
        onScroll={onFlatListScroll}
        pagingEnabled
        keyExtractor={(item, index) => String(index)}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        horizontal
        snapToAlignment="center"
        initialScrollIndex={initialScrollIndex}
        onEndReachedThreshold={1}
        {...rest}
      />
    )
  }
)

export default HorizontalScreenList
