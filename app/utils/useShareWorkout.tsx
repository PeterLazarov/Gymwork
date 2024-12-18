import { usePortal } from '@gorhom/portal'
import { shareAsync } from 'expo-sharing'
import { DateTime } from 'luxon'
import React from 'react'
import { Alert, LogBox, View } from 'react-native'
import { captureRef } from 'react-native-view-shot'

import MiniTimer from 'app/components/MiniTimer'
import WorkoutDayView from 'app/components/Workout/WorkoutDayView'
import { Workout } from 'app/db/models'
import { translate } from 'app/i18n'
import { Header } from 'designSystem'

import { defaultIgnoredWarnings } from './ignoreWarnings'

export const offscreenRef = React.createRef<View>()

const tempPortalKey = 'tempPortalKey'
const waitingTime = 500

export function useShareWorkout() {
  const { addPortal, removePortal } = usePortal('offscreen')

  return async (workout: Workout) => {
    let handle: NodeJS.Timeout

    let resolve: () => void
    const onReadyPromise = new Promise<void>(_resolve => {
      resolve = _resolve
    })

    LogBox.ignoreLogs(
      defaultIgnoredWarnings.concat(
        'Each child in a list should have a unique "key" prop'
      )
    )

    addPortal(
      tempPortalKey,
      <View
        onLayout={e => {
          if (handle) {
            clearTimeout(handle)
          }
          handle = setTimeout(() => {
            resolve()
          }, waitingTime)
        }}
        style={{ width: 480 }}
      >
        <Header>
          <Header.Title
            title={DateTime.fromISO(workout.date).toFormat('ccc, MMM dd, yyyy')}
          />
          <MiniTimer
            n={Math.floor(
              workout.inferredHistoricalDuration?.as('minutes') || 0
            )}
          />
        </Header>
        <WorkoutDayView date={workout.date} />
      </View>
    )

    onReadyPromise.then(async () => {
      try {
        const imgFileURL = await captureRef(offscreenRef, {
          format: 'png',
        })
        await shareAsync(`file://${imgFileURL}`, {
          mimeType: 'image/png',
          UTI: '.png',
        })
      } catch (error) {
        Alert.alert(translate('sharingFailed'))
      } finally {
        removePortal(tempPortalKey)
        LogBox.ignoreLogs(defaultIgnoredWarnings)
      }
    })
  }
}
