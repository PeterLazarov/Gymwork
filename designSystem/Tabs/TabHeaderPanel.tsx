import React from 'react'
import { View, StyleSheet } from 'react-native'

import TabHeader from './TabHeader'
import { TabConfig, TabStyles } from './types'
import { colors } from '../tokens'

type Props = {
  tabsConfig: readonly TabConfig[]
  style?: TabStyles['header']
  currentIndex: number
  scrollableContainer?: boolean
  onHeaderPress: (index: number) => void
  headerSize?: 'md' | 'lg'
}
const TabHeaderPanel: React.FC<Props> = ({
  tabsConfig,
  style,
  headerSize = 'md',
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {tabsConfig.length &&
        tabsConfig.map((item, index) => (
          <TabHeader
            size={headerSize}
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
    alignItems: 'center',
    backgroundColor: colors.primaryLighter,
  },
})

export default TabHeaderPanel
