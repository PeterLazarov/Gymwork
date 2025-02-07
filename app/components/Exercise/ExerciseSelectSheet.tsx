import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { createRef, useState } from 'react'
import { Dimensions, Platform, View } from 'react-native'

import { Exercise } from '@/db/models'
import { useAppTheme } from '@/utils/useAppTheme'

import ExerciseSelectLists from './ExerciseSelectLists'

let promise: PromiseWithResolvers<Exercise[]>

// Rough shitty guess -> real info
let initialSheetSize = Dimensions.get('screen').height - 100

export function showExerciseSelect(multiSelect = false): Promise<Exercise[]> {
  const sheet = exerciseListSheet.current!

  if (promise) {
    promise.reject()
    sheet.dismiss()
  }

  promise = Promise.withResolvers<Exercise[]>()

  sheet.present()

  return promise.promise
}

const exerciseListSheet = createRef<TrueSheet>()

{
  /* If scrolling breaks https://sheet.lodev09.com/guides/scrolling */
}
export function ExerciseSelectSheet() {
  const [sheetSize, setSheetSize] = useState(initialSheetSize)

  const { theme } = useAppTheme()

  return (
    <TrueSheet
      ref={exerciseListSheet}
      sizes={['large']}
      backgroundColor={theme.colors.surfaceContainer}
      onPresent={({ value }) => {
        initialSheetSize = value
        setSheetSize(value)
      }}
      contentContainerStyle={{
        paddingTop: theme.spacing.md,
        paddingBottom: Platform.select({ ios: theme.spacing.md, android: 0 }),
      }}
    >
      <View style={{ height: sheetSize }}>
        <ExerciseSelectLists
          onChange={exercises => {
            promise.resolve(exercises)
            exerciseListSheet.current?.dismiss()
          }}
          selected={[]}
          multiselect={false}
        />
      </View>
    </TrueSheet>
  )
}
