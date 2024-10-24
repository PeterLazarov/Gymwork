import { View, ViewProps, TextProps, useColorScheme } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { Text, useColors, fontSize } from '.'

interface SubComponents {
  Title: React.FC<HeaderTitleProps>
}

const padding = 12
export const Header: React.FC<ViewProps> & SubComponents = props => {
  const colors = useColors()
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
  const colors = useColors()
  const colorScheme = useColorScheme()

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
          color: colorScheme === 'light' ? colors.onPrimary : colors.onSurface,
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
