import { TextProps, useColorScheme, View, ViewProps } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { useAppTheme } from '@/utils/useAppTheme'

import { Text } from './Text'

interface SubComponents {
  Title: React.FC<HeaderTitleProps>
}

export const Header: React.FC<ViewProps> & SubComponents = props => {
  const {
    theme: { colors, spacing },
  } = useAppTheme()
  const padding = spacing.sm
  const colorScheme = useColorScheme()

  return (
    <SafeAreaInsetsContext.Consumer>
      {insets => (
        <View
          style={{
            backgroundColor:
              colorScheme === 'light' ? colors.primary : colors.shadow,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: padding,
            paddingBottom: padding,
            paddingTop: (insets?.top ?? 0) + padding,
            zIndex: 1,
            width: '100%',
          }}
          {...props}
        />
      )}
    </SafeAreaInsetsContext.Consumer>
  )
}
Header.displayName = 'Header'

type HeaderTitleProps = {
  title: string
  numberOfLines?: TextProps['numberOfLines']
}
const HeaderTitle: React.FC<HeaderTitleProps> = ({
  title,
  numberOfLines = 1,
}) => {
  const {
    theme: {
      colors,
      isDark,
      typography: { fontSize },
    },
  } = useAppTheme()

  return (
    <View
      style={{
        marginLeft: 10,
        alignItems: 'flex-start',
        flex: 1,
      }}
    >
      <Text
        style={{
          color: isDark ? colors.onSurface : colors.onPrimary,
          fontSize: fontSize.lg,
        }}
        numberOfLines={numberOfLines}
      >
        {title}
      </Text>
    </View>
  )
}
HeaderTitle.displayName = 'HeaderTitle'
Header.Title = HeaderTitle
