import React, { ReactNode } from 'react'
import { View, ViewStyle } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { useStores } from 'app/db/helpers/useStores'
import { KeyboardExpandingView } from 'designSystem'

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
  const {
    theme: { colors },
  } = useAppTheme()
  const { stateStore } = useStores()

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
      <KeyboardExpandingView
        footerHeight={hasFooter ? stateStore.footerHeight : undefined}
      />
    </View>
  )
}
