import _ from 'lodash'
import React, { useState, useCallback, useMemo } from 'react'
import { Alert, StyleSheet } from 'react-native'
import {
  Text,
  View,
  SectionsWheelPicker,
  SegmentedControl,
  Button,
  WheelPicker,
  WheelPickerProps,
  Constants,
  Switch,
  Colors,
} from 'react-native-ui-lib'

export type CardioInputProps = {}

export const CardioInput = (props: CardioInputProps) => {
  return <SectionsWheelPickerScreen />
}

const SPEED = _.times(400, i => i / 10)
const ELEVATION = _.times(200, i => i / 10)
const DIFFICULTY = _.times(100, i => i)

const SectionsWheelPickerScreen = () => {
  const [numOfSections, setNumOfSections] = useState(1)
  const [selectedSpeed, setSelectedDays] = useState(0)
  const [selectedElevation, setSelectedHours] = useState(0)
  const [selectedDifficulty, setSelectedMinutes] = useState(0)

  const getItems = useCallback((values: (number | string)[]) => {
    return _.map(values, item => ({ label: '' + item, value: item }))
  }, [])

  const onSpeedChange = useCallback((item: number | string) => {
    setSelectedDays(item as number)
  }, [])

  const onElevationChange = useCallback((item: number | string) => {
    setSelectedHours(item as number)
  }, [])

  const onDifficultyChange = useCallback((item: number | string) => {
    setSelectedMinutes(item as number)
  }, [])

  const onSavePress = useCallback(() => {
    Alert.alert(
      JSON.stringify(
        {
          selectedSpeed,
          selectedElevation,
          selectedDifficulty,
        },
        undefined,
        2
      )
    )
  }, [numOfSections, selectedSpeed, selectedElevation, selectedDifficulty])

  const onResetPress = useCallback(() => {
    setSelectedDays(0)
    setSelectedHours(0)
    setSelectedMinutes(0)
  }, [])

  const sections: WheelPickerProps<string | number>[] = useMemo(() => {
    return [
      {
        items: getItems(SPEED),
        onChange: onSpeedChange,
        initialValue: selectedSpeed,
        label: 'Speed',
        align:
          numOfSections === 1
            ? WheelPicker.alignments.CENTER
            : WheelPicker.alignments.RIGHT,
        style: {
          flex: 1,
          //   flexDirection:
          // numOfSections !== 1 && Constants.isRTL && !disableRTL
          //   ? 'row-reverse'
          //   : undefined,
        },
      },
      {
        items: getItems(ELEVATION),
        onChange: onElevationChange,
        initialValue: selectedElevation,
        label: 'Elevation',
        // align:
        //   numOfSections === 2
        //     ? shouldDisableRTL
        //       ? WheelPicker.alignments.RIGHT
        //       : WheelPicker.alignments.LEFT
        //     : WheelPicker.alignments.CENTER,
        style:
          numOfSections === 2
            ? {
                flex: 1,
                // flexDirection: shouldDisableRTL ? 'row-reverse' : 'row',
              }
            : undefined,
      },
      {
        items: getItems(DIFFICULTY),
        onChange: onDifficultyChange,
        initialValue: selectedDifficulty,
        label: 'Difficulty',
        // align: shouldDisableRTL
        //   ? WheelPicker.alignments.RIGHT
        //   : WheelPicker.alignments.LEFT,
        style: {
          flex: 1,
          //   flexDirection: shouldDisableRTL ? 'row-reverse' : 'row',
        },
      },
    ]
  }, [
    getItems,
    selectedSpeed,
    selectedElevation,
    selectedDifficulty,
    onSpeedChange,
    onElevationChange,
    onDifficultyChange,
    numOfSections,
  ])

  const sectionsToPresent = useMemo(
    () => _.slice(sections, 0, numOfSections),
    [numOfSections, sections]
  )

  const onChangeIndex = useCallback((index: number) => {
    return setNumOfSections(index + 1)
  }, [])

  return (
    <View>
      <View
        centerH
        marginT-20
      >
        <SegmentedControl
          segments={[
            { label: '1 section' },
            { label: '2 sections' },
            { label: '3 sections' },
          ]}
          onChangeIndex={onChangeIndex}
          throttleTime={400}
        />
      </View>
      <SectionsWheelPicker
        numberOfVisibleRows={4}
        sections={sectionsToPresent}
      />
      <View
        paddingB-20
        center
        spread
        row
        style={styles.bottomDivider}
      >
        <Button
          marginR-40
          link
          label={'Save'}
          onPress={onSavePress}
        />
        <Button
          label={'Reset'}
          link
          onPress={onResetPress}
        />
      </View>
    </View>
  )
}

// export default SectionsWheelPickerScreen;

const styles = StyleSheet.create({
  bottomDivider: {
    borderBottomColor: Colors.$outlineDefault,
    borderBottomWidth: 4,
  },
})
