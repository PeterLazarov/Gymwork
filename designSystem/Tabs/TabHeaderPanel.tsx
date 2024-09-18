import React from 'react'
import { View, StyleSheet } from 'react-native'

import TabHeader from './TabHeader'
import { TabConfig, TabStyles } from './types'
import { useColors } from '../tokens'

type Props = {
  tabsConfig: readonly TabConfig<any>[]
  style?: TabStyles['header']
  currentIndex: number
  scrollableContainer?: boolean
  onHeaderPress: (index: number) => void
}
const TabHeaderPanel: React.FC<Props> = ({ tabsConfig, style, ...rest }) => {
  const colors = useColors()
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: colors.mat.surfaceContainerLowest,
    },
  })

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

export default TabHeaderPanel
