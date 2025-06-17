import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'
import { useColors } from '../tokens'
import TabButton from './TabButton'

export type TopTabConfig = {
  name: string
  Component: React.ComponentType
}

type Props = {
  tabsConfig: TopTabConfig[]
  initialTabIndex?: number
  tabWidth?: number
  onTabChange?: (name: string) => void
  swipeDisabled?: boolean
  tabHeight?: number
  style?: ViewStyle
  tabStyle?: ViewStyle
  labelStyle?: TextStyle
  activeLabelStyle?: TextStyle
  indicatorStyle?: ViewStyle
}

const TopTabs: React.FC<Props> = ({
  tabsConfig,
  initialTabIndex = 0,
  tabWidth,
  tabHeight = 48,
  onTabChange,
  swipeDisabled,
  style,
  tabStyle,
  labelStyle,
  activeLabelStyle,
  indicatorStyle,
}) => {
  const colors = useColors()
  const { width: windowWidth } = useWindowDimensions()
  const [activeIndex, setActiveIndex] = useState(initialTabIndex)
  const scrollX = useRef(new Animated.Value(0)).current
  const contentRef = useRef<ScrollView>(null)
  const tabsRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Set initial scroll positions
    const offset = initialTabIndex * windowWidth
    contentRef.current?.scrollTo({ x: offset, animated: false })

    // Center the initial tab in the tab bar
    if (tabWidth) {
      const tabOffset = initialTabIndex * tabWidth
      tabsRef.current?.scrollTo({
        x: tabOffset - windowWidth / 2 + tabWidth / 2,
        animated: false,
      })
    }
  }, [])

  const onTabPress = useCallback(
    (index: number) => {
      const offset = index * windowWidth
      contentRef.current?.scrollTo({ x: offset, animated: true })

      // Center the tab in the tab bar
      const tabOffset = index * (tabWidth || 0)
      tabsRef.current?.scrollTo({
        x: tabOffset - windowWidth / 2 + (tabWidth || 0) / 2,
        animated: true,
      })

      setActiveIndex(index)
      const selectedTab = tabsConfig[index]
      if (selectedTab) {
        onTabChange?.(selectedTab.name)
      }
    },
    [windowWidth, tabWidth, onTabChange, tabsConfig]
  )

  const styles = makeStyles(colors, tabHeight)

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={tabsRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabBarContent}
      >
        {tabsConfig.map((tab, index) => (
          <TabButton
            key={tab.name}
            tab={tab}
            onPress={() => onTabPress(index)}
            isActive={index === activeIndex}
            tabHeight={tabHeight}
            tabWidth={tabWidth}
            tabStyle={tabStyle}
            labelStyle={labelStyle}
            activeLabelStyle={activeLabelStyle}
            indicatorStyle={indicatorStyle}
          />
        ))}
      </ScrollView>

      <ScrollView
        ref={contentRef}
        horizontal
        pagingEnabled
        scrollEnabled={!swipeDisabled}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={e => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / windowWidth
          )
          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex)
            const selectedTab = tabsConfig[newIndex]
            if (selectedTab) {
              onTabChange?.(selectedTab.name)
            }
          }
        }}
        scrollEventThrottle={16}
      >
        {tabsConfig.map((tab, index) => (
          <View
            key={tab.name}
            style={{ width: windowWidth }}
          >
            <tab.Component />
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const makeStyles = (colors: ReturnType<typeof useColors>, tabHeight: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    tabBar: {
      maxHeight: tabHeight,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
      backgroundColor: colors.surface,
      zIndex: 0,
    },
    tabBarContent: {
      flexGrow: 1,
    },
  })

export default TopTabs
