import React, { useMemo, useState } from 'react'
import { View } from 'react-native'

import {
  Header,
  Icon,
  IconButton,
  PressableHighlight,
  SwipeTabs,
  colors,
} from 'designSystem'

import { useStores } from 'app/db/helpers/useStores'
import ExerciseSelectLists from 'app/components/Exercise/ExerciseSelectLists'
import ExerciseChartStats from 'app/components/ExerciseStats/ExerciseChartStats'
import ExerciseHistoryStats from 'app/components/ExerciseStats/ExerciseHistoryStats'
import ExerciseRecordStats from 'app/components/ExerciseStats/ExerciseRecordStats'
import ExerciseRow from 'app/components/ExerciseRow'
import EmptyState from 'app/components/EmptyState'
import { translate } from 'app/i18n'
import { observer } from 'mobx-react-lite'
import { TabsLayout } from 'app/layouts/TabsLayout'

export default observer(function ReviewScreen(props: {}) {
  const { stateStore } = useStores()
  const [exerciseSelectOpen, setExerciseSelectOpen] = useState(false)

  const selectedExercise = useMemo(() => {
    return stateStore.reviewFocusedExercise ?? stateStore.focusedExercise
  }, [stateStore.reviewFocusedExercise, stateStore.focusedSet?.exercise])

  // const rowOptions = useMemo(() => {
  //   return stateStore.focusedStep?.exercises?.includes(
  //     //   @ts-ignore
  //     stateStore.reviewFocusedExercise ?? stateStore.focusedSet?.exercise
  //   )
  //     ? stateStore.focusedStep?.exercises
  //     : []
  // }, [selectedExercise, stateStore.focusedStep?.exercises])

  return (
    <>
      <Header>
        {exerciseSelectOpen && (
          <IconButton
            onPress={() => setExerciseSelectOpen(false)}
            underlay="darker"
          >
            <Icon
              color={colors.primaryText}
              icon="chevron-back"
            />
          </IconButton>
        )}

        <Header.Title
          title={
            exerciseSelectOpen
              ? translate('selectExercise')
              : selectedExercise?.name ?? 'Review'
          }
        />

        {stateStore.focusedExercise && (
          <IconButton
            onPress={() =>
              stateStore.setProp(
                'reviewFocusedExerciseGuid',
                stateStore.focusedExerciseGuid
              )
            }
            underlay="darker"
          >
            <Icon
              icon="dumbbell"
              color={colors.primaryText}
            />
          </IconButton>
        )}
        <IconButton
          onPress={() => setExerciseSelectOpen(true)}
          underlay="darker"
        >
          <Icon
            icon="list-outline"
            color={colors.primaryText}
          />
        </IconButton>
      </Header>

      <View
        style={{
          flexGrow: 1,
          position: 'relative',
        }}
      >
        {exerciseSelectOpen && (
          <ExerciseSelectLists
            multiselect={false}
            selected={[]}
            onChange={([e]) => {
              stateStore.setProp('reviewFocusedExerciseGuid', e?.guid)
              setExerciseSelectOpen(false)
            }}
          />
        )}

        {/* {!exerciseSelectOpen && (
          <ExerciseRow
            selected={selectedExercise}
            onPress={() => {
              setExerciseSelectOpen(true)
            }}
            options={rowOptions}
          />
        )} */}

        {!exerciseSelectOpen && selectedExercise && (
          <SwipeTabs
            tabsConfig={[
              {
                label: translate('chart'),
                name: 'Chart',
                component: ExerciseChartStats,
                props: { exercise: selectedExercise },
              },
              {
                label: translate('records'),
                name: 'Records',
                component: ExerciseRecordStats,
                props: { exercise: selectedExercise },
              },
              {
                label: translate('history'),
                name: 'History',
                component: ExerciseHistoryStats,
                props: { exercise: selectedExercise },
              },
            ]}
          />
        )}

        {!exerciseSelectOpen && !selectedExercise && (
          <PressableHighlight
            style={{ flex: 1 }}
            onPress={() => setExerciseSelectOpen(true)}
          >
            <EmptyState text={translate('selectExerciseForData')} />
          </PressableHighlight>
        )}
      </View>
    </>
  )
})
