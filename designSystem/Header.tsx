import { View, Text, ViewProps } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { colors, fontSize } from './tokens'

interface SubComponents {
  Title: React.FC<HeaderTitleProps>
}
export const Header: React.FC<ViewProps> & SubComponents = props => (
  <SafeAreaInsetsContext.Consumer>
    {insets => (
      <View
        style={{
          backgroundColor: colors.primary,
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
Header.displayName = 'Header'

type HeaderTitleProps = {
  title: string
}
const HeaderTitle: React.FC<HeaderTitleProps> = ({ title }) => (
  <View style={{ marginLeft: 10, alignItems: 'flex-start', flex: 1 }}>
    <Text style={{ color: colors.primaryText, fontSize: fontSize.lg }}>
      {title}
    </Text>
  </View>
)
HeaderTitle.displayName = 'HeaderTitle'
Header.Title = HeaderTitle
