import React, { useMemo, useState } from 'react'
import { View } from 'react-native'

import TabHeaderPanel from './TabHeaderPanel'
import { TabConfig, TabStyles } from './types'

type Props = {
  style?: TabStyles
  tabsConfig: TabConfig<any>[]
  initialActiveIndex?: number
  onTabChange?: (name: string) => void
}
const Tabs: React.FC<Props> = ({
  style,
  tabsConfig,
  initialActiveIndex = 0,
  onTabChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex)
  const activeTab = useMemo(() => tabsConfig[activeIndex], [activeIndex])
  const ActiveTabComponent = useMemo(() => activeTab.component, [activeIndex])

  const onTabPress = (index: number) => {
    const newActive = tabsConfig[index]
    if (index !== activeIndex) {
      setActiveIndex(index)
      onTabChange?.(newActive.name)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <TabHeaderPanel
        style={style?.header}
        tabsConfig={tabsConfig}
        currentIndex={activeIndex}
        onHeaderPress={onTabPress}
      />
      <ActiveTabComponent {...activeTab.props} />
    </View>
  )
}

export default Tabs
