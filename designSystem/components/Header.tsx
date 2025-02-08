import { useNavigation } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import { TextProps, View, ViewProps } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { useAppTheme } from '@/utils/useAppTheme'

export function HeaderRight(props: { children: React.ReactNode }) {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    const top = navigation
    // while (top.getParent()) {
    //   top = top.getParent()
    // }
    top.setOptions({
      headerRight(defaultProps) {
        return (
          <>
            {defaultProps.canGoBack && defaultProps.defaultHandler?.()}
            {props.children}
          </>
        )
      },
    })
  }, [props.children])

  return null
}

export function HeaderLeft(props: { children: React.ReactNode }) {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    let top = navigation
    while (top.getParent()) {
      top = top.getParent()
    }
    top.setOptions({
      headerLeft(defaultProps) {
        return (
          <>
            {defaultProps.canGoBack && defaultProps.defaultHandler?.()}
            {props.children}
          </>
        )
      },
    })
  }, [props.children])

  return null
}

type HeaderTitleProps = {
  title: string
  // nestingLevels:0,
  numberOfLines?: TextProps['numberOfLines']
}
export function HeaderTitle({
  title,
  // nestingLevelsm
  numberOfLines = 1,
}: HeaderTitleProps) {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    const top = navigation
    // while (top.getParent()) {
    //   top = top.getParent()
    // }
    top.setOptions({
      title,
    })
  }, [title])

  return null
}
