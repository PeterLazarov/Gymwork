import React from 'react'
import { View, StyleSheet } from 'react-native'

import TabHeader from './TabHeader'
import { TabConfig, TabStyles } from './types'
import { colors } from '../tokens'

type Props = {
  tabsConfig: ReadonlyArray<TabConfig>
  style?: TabStyles['header']
  currentIndex: number
  scrollableContainer?: boolean
  onHeaderPress: (index: number) => void
}
const TabHeaderPanel: React.FC<Props> = ({ tabsConfig, style, ...rest }) => {
  return (
    <View style={styles.container}>
      {tabsConfig.length &&
        tabsConfig.map((item, index) => (
          <TabHeader
            key={index}
            index={index}
            item={item}
            style={style}
            {...rest}
          />
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    alignItems: 'center',
    backgroundColor: colors.lightgray,
  },
})

export default TabHeaderPanel
