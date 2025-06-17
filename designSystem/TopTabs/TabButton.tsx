import React from 'react'
import {
  Animated,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import { Text } from '../Text'
import { useColors } from '../tokens'
import { spacing } from '../tokens/spacing'
import { TopTabConfig } from './TopTabs'

type Props = {
  tab: TopTabConfig
  isActive: boolean
  onPress: () => void
  tabHeight: number
  tabWidth?: number
  tabStyle?: ViewStyle
  labelStyle?: TextStyle
  activeLabelStyle?: TextStyle
  indicatorStyle?: ViewStyle
}

const TabButton: React.FC<Props> = ({
  tab,
  isActive,
  onPress,
  tabHeight,
  tabWidth,
  tabStyle,
  labelStyle,
  activeLabelStyle,
  indicatorStyle,
}) => {
  const colors = useColors()
  const styles = makeStyles(colors, tabHeight)
  return (
    <TouchableOpacity
      key={tab.name}
      onPress={onPress}
      style={[styles.tab, { minWidth: tabWidth }, tabStyle]}
    >
      <Text
        style={[
          styles.tabText,
          labelStyle,
          isActive && styles.activeTabText,
          isActive && activeLabelStyle,
        ]}
      >
        {tab.name}
      </Text>
      {isActive && <Animated.View style={[styles.indicator, indicatorStyle]} />}
    </TouchableOpacity>
  )
}

const makeStyles = (colors: ReturnType<typeof useColors>, tabHeight: number) =>
  StyleSheet.create({
    tab: {
      height: tabHeight,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
      position: 'relative',
    },
    tabText: {
      color: colors.onSurfaceVariant,
    },
    activeTabText: {
      color: colors.primary,
      fontWeight: '600',
    },
    indicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      backgroundColor: colors.primary,
    },
  })

export default TabButton
