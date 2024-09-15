import { View, Text, ViewProps, TextProps, useColorScheme } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { useColors, fontSize } from './tokens'

interface SubComponents {
  Title: React.FC<HeaderTitleProps>
}
export const Header: React.FC<ViewProps> & SubComponents = props => {
  const colors = useColors()
  const colorScheme = useColorScheme()

  return (
    <SafeAreaInsetsContext.Consumer>
      {insets => (
        <View
          style={{
            backgroundColor:
              colorScheme === 'light' ? colors.primary : colors.neutralLight,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingBottom: 12,
            paddingTop: insets && insets.top > 0 ? insets.top : 12,
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
const HeaderTitle: React.FC<HeaderTitleProps> = ({ title, numberOfLines }) => {
  const colors = useColors()

  return (
    <View style={{ marginLeft: 10, alignItems: 'flex-start', flex: 1 }}>
      <Text
        style={{ color: colors.primaryText, fontSize: fontSize.lg }}
        numberOfLines={numberOfLines}
      >
        {title}
      </Text>
    </View>
  )
}
HeaderTitle.displayName = 'HeaderTitle'
Header.Title = HeaderTitle
