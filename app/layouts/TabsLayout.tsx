import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { View } from 'react-native'

import { BottomNavigator } from '@/navigators/BottomNavigator'

import { EmptyLayout } from './EmptyLayout'

type Props = {
  children?: ReactNode
}
const TabsLayout: React.FC<Props> = ({ children }) => {
  return (
    <EmptyLayout hasFooter>
      <View style={{ flex: 1 }}>{children}</View>
      <BottomNavigator />
    </EmptyLayout>
  )
}

export default observer(TabsLayout)
