import { useNavigation } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import { TextProps, View, ViewProps } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { useAppTheme } from '@/utils/useAppTheme'

import { Text } from './Text'

interface SubComponents {
  Title: React.FC<HeaderTitleProps>
}

export const Header: React.FC<ViewProps & { children: React.ReactNode }> &
  SubComponents = props => {
  const {
    theme: { colors, spacing, isDark },
  } = useAppTheme()
  // const padding = spacing.sm

  const navigation = useNavigation()

  useLayoutEffect(() => {
    let top = navigation
    while (top.getParent()) {
      top = top.getParent()
    }
    top.setOptions({
      headerRight(_) {
        return props.children
      },
    })
  }, [props.children])

  return null
}
Header.displayName = 'Header'

type HeaderTitleProps = {
  title: string
  // nestingLevels:0,
  numberOfLines?: TextProps['numberOfLines']
}
const HeaderTitle: React.FC<HeaderTitleProps> = ({
  title,
  // nestingLevelsm
  numberOfLines = 1,
}) => {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    let top = navigation
    while (top.getParent()) {
      top = top.getParent()
    }
    top.setOptions({
      title,
    })
  }, [title])

  return null
}
HeaderTitle.displayName = 'HeaderTitle'
Header.Title = HeaderTitle
