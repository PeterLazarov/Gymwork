import { TrueSheet, TrueSheetProps } from '@lodev09/react-native-true-sheet'
import { useNavigation } from '@react-navigation/native'
import { DateTime } from 'luxon'
import { useState, useRef, forwardRef } from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useAppTheme } from '@/utils/useAppTheme'
import { useStores } from 'app/db/helpers/useStores'
import { Workout } from 'app/db/models'
import { translate } from 'app/i18n'
import {
  Button,
  ButtonText,
  Divider,
  Text,
  ToggleSwitch,
  fontSize,
  spacing,
} from 'designSystem'

import WorkoutCommentsCard from '../Workout/WorkoutCommentsCard'

import WorkoutSheetStepItem from './WorkoutSheetStepItem'

export interface WorkoutSheetProps extends TrueSheetProps {
  workout?: Workout
  mode: 'copy' | 'view'
  showComments?: boolean
}

const WorkoutSheet = forwardRef<TrueSheet, WorkoutSheetProps>(
  function WorkoutSheet({ mode, workout, showComments, ...rest }, sheetRef) {
    const { workoutStore, stateStore } = useStores()
    const [includeSets, setIncludeSets] = useState(true)

    const label = workout?.date
      ? DateTime.fromISO(workout?.date).toLocaleString(
          DateTime.DATE_MED_WITH_WEEKDAY
        )
      : ''

    const { navigate } = useNavigation()

    const {
      theme: { colors },
    } = useAppTheme()

    const onActionPress = () => {
      if (mode === 'copy') {
        workoutStore.copyWorkout(workout!, includeSets)
      } else if (mode === 'view') {
        stateStore.setOpenedDate(workout.date)
      }

      navigate('Home', {
        screen: 'WorkoutStack',
        params: { screen: 'Workout', params: {} },
      })

      sheetRef.current?.dismiss()
    }

    const scrollViewRef = useRef<ScrollView>(null)

    return (
      <TrueSheet
        ref={sheetRef}
        sizes={['large']}
        blurTint="default"
        backgroundColor={colors.surface}
        scrollRef={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 48 }}
        FooterComponent={() => (
          <>
            {mode === 'copy' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: spacing.xxs,
                  gap: spacing.xs,
                }}
              >
                <Text style={{ color: colors.onSurface }}>
                  {translate('includeSets')}
                </Text>
                <ToggleSwitch
                  variant="primary"
                  value={includeSets}
                  onValueChange={setIncludeSets}
                />
              </View>
            )}
            <View style={{ flexDirection: 'row', height: 48 }}>
              <Button
                variant="tertiary"
                style={{ flex: 1 }}
                onPress={() => {
                  sheetRef.current?.dismiss()
                }}
              >
                <ButtonText variant="tertiary">
                  {translate('cancel')}
                </ButtonText>
              </Button>
              <Button
                variant="tertiary"
                style={{ flex: 1 }}
                onPress={onActionPress}
              >
                <ButtonText variant="tertiary">
                  {translate(mode === 'copy' ? 'copyWorkout' : 'goToWorkout')}
                </ButtonText>
              </Button>
            </View>
          </>
        )}
        {...rest}
      >
        <View style={{ height: '100%' }}>
          <Text
            style={{
              fontSize: fontSize.lg,
              textAlign: 'center',
              padding: spacing.md,
            }}
          >
            {label}
          </Text>
          <Divider
            orientation="horizontal"
            variant="primary"
          />
          <View style={{ flex: 1 }}>
            {showComments && workout?.hasComments && (
              <WorkoutCommentsCard
                workout={workout}
                compactMode
              />
            )}
            <ScrollView
              ref={scrollViewRef}
              nestedScrollEnabled
            >
              {workout?.steps.map(step => (
                <WorkoutSheetStepItem
                  key={step.guid}
                  step={step}
                />
              ))}
            </ScrollView>
          </View>

          {/* <View style={{ flexDirection: 'row' }}>
            <Button
              variant="tertiary"
              style={{ flex: 1 }}
              onPress={() => {
                sheetRef.current?.dismiss()
              }}
            >
              <ButtonText variant="tertiary">{translate('cancel')}</ButtonText>
            </Button>
            <Button
              variant="tertiary"
              style={{ flex: 1 }}
              onPress={onActionPress}
            >
              <ButtonText variant="tertiary">
                {translate(mode === 'copy' ? 'copyWorkout' : 'goToWorkout')}
              </ButtonText>
            </Button>
          </View> */}
        </View>
      </TrueSheet>
    )
  }
)
export default WorkoutSheet
