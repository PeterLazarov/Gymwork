import React, { ReactNode } from 'react'
import { Platform, View, ViewStyle } from 'react-native'

import { KeyboardExpandingView, useColors } from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'

type Props = {
  children?: ReactNode
  style?: ViewStyle
  hasFooter?: boolean
}
export const EmptyLayout: React.FC<Props> = ({
  children,
  style,
  hasFooter,
}) => {
  const colors = useColors()
  const { stateStore } = useStores()
  //TODO: test if android version 26 is the cutoff
  const renderExpandingView =
    Platform.OS === 'ios' ||
    (Platform.OS === 'android' && Platform.Version < 26)

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.surfaceContainer,
        },
        style,
      ]}
    >
      {children}
      {renderExpandingView && (
        <KeyboardExpandingView
          footerHeight={hasFooter ? stateStore.footerHeight : undefined}
        />
      )}
    </View>
  )
}
