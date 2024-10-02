import React, { ReactNode, useEffect, useRef } from 'react'
import { BackHandler, TouchableOpacity } from 'react-native'
import { Portal } from 'react-native-paper'
import BottomSheet from '@gorhom/bottom-sheet'

type Props = {
  visible: boolean
  height: number
  children: ReactNode
  onCollapse: () => void
}
const BottomDrawer: React.FC<Props> = ({
  visible,
  height,
  children,
  onCollapse,
}) => {
  const sheetRef = useRef<BottomSheet>(null)

  useEffect(() => {
    if (visible) {
      sheetRef.current?.expand()
    } else {
      sheetRef.current?.close()
    }
  }, [visible, sheetRef.current])

  function collapse() {
    sheetRef.current?.close()
    onCollapse()
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (visible) {
          collapse()
          return true
        }
      }
    )

    return () => backHandler.remove()
  }, [visible])

  return (
    <Portal>
      <BottomSheet
        ref={sheetRef}
        enableDynamicSizing={false}
        enablePanDownToClose
        animateOnMount
        index={visible ? 0 : -1}
        snapPoints={[height]} // Define
        onChange={index => {
          if (index === -1) collapse()
        }}
        backdropComponent={() =>
          visible && (
            <TouchableOpacity
              onPress={collapse}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'black',
                opacity: 0.5,
              }}
              activeOpacity={0.5}
            />
          )
        }
        handleStyle={{
          display: 'none',
        }}
      >
        {children}
      </BottomSheet>
    </Portal>
  )
}

export default BottomDrawer
