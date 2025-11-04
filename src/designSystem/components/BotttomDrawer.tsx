import React, { ReactNode, useEffect, useMemo } from "react"
import { BackHandler, useWindowDimensions } from "react-native"
import { Portal } from "@gorhom/portal"
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated"
import { Backdrop } from "./Backdrop"

// TODO: fix the collapse animation
type Props = {
  visible: boolean
  height: number
  children: ReactNode
  onCollapse: () => void
}
export const BottomDrawer: React.FC<Props> = ({ visible, height, children, onCollapse }) => {
  const dimensions = useWindowDimensions()

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!visible) return false

      onCollapse()
      return true
    })

    return () => backHandler.remove()
  }, [visible])

  const animations = useMemo(() => {
    return {
      entering: SlideInDown.duration(150).withInitialValues({
        originY: dimensions.height,
      }),

      exiting: SlideOutDown.withInitialValues({
        originY: dimensions.height - height,
      }),
    }
  }, [dimensions.height, height])

  return (
    <Portal>
      {visible && (
        <>
          <Animated.View
            entering={animations.entering}
            exiting={animations.exiting}
            style={{
              zIndex: 1,
              position: "absolute",
              width: "100%",
              bottom: 0,
            }}
          >
            {children}
          </Animated.View>

          <Backdrop onPress={onCollapse} />
        </>
      )}
    </Portal>
  )
}
