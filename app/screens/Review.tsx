import React, { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import {
  Header,
  Icon,
  IconButton,
  PressableHighlight,
  SwipeTabs,
  useColors,
} from 'designSystem'

import { useStores } from 'app/db/helpers/useStores'
import ExerciseSelectLists from 'app/components/Exercise/ExerciseSelectLists'
import ExerciseChartStats from 'app/components/ExerciseStats/ExerciseChartStats'
import ExerciseHistoryStats from 'app/components/ExerciseStats/ExerciseHistoryStats'
import ExerciseRecordStats from 'app/components/ExerciseStats/ExerciseRecordStats'
import EmptyState from 'app/components/EmptyState'
import { translate } from 'app/i18n'
import { observer } from 'mobx-react-lite'

export default observer(function ReviewScreen(props: {}) {
  const colors = useColors()

  const { stateStore } = useStores()
  const [exerciseSelectOpen, setExerciseSelectOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(
    stateStore.focusedExercise
  )

  useEffect(() => {
    if (stateStore.focusedExercise) {
      setSelectedExercise(stateStore.focusedExercise)
    }
  }, [stateStore.focusedExercise])

  const tabsConfig = [
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
  ]

  const defaultIndex = useMemo(() => {
    return stateStore.reviewLastTab
      ? tabsConfig.map(t => t.name).indexOf(stateStore.reviewLastTab)
      : 0
  }, [stateStore.reviewLastTab])

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
          backgroundColor: colors.neutralLighter,
        }}
      >
        {exerciseSelectOpen && (
          <ExerciseSelectLists
            multiselect={false}
            selected={[]}
            onChange={([e]) => {
              if (e) {
                setSelectedExercise(e)
              }
              setExerciseSelectOpen(false)
            }}
          />
        )}

        {!exerciseSelectOpen && selectedExercise && (
          <SwipeTabs
            defaultIndex={defaultIndex}
            tabsConfig={tabsConfig}
            onTabChange={tab => {
              stateStore.setProp('reviewLastTab', tab)
            }}
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
