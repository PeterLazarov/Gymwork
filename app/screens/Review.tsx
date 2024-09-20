import React, { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { Header, Icon, IconButton, SwipeTabs, useColors } from 'designSystem'

import { useStores } from 'app/db/helpers/useStores'
import ExerciseSelectLists from 'app/components/Exercise/ExerciseSelectLists'
import ExerciseChartReview from 'app/components/Review/ExerciseChartReview'
import ExerciseHistoryReview from 'app/components/Review/ExerciseHistoryReview'
import ExerciseRecordReview from 'app/components/Review/ExerciseRecordReview'
import { translate } from 'app/i18n'
import ExerciseView from 'app/components/ExerciseHistoryChart/ExerciseView'
import { Menu } from 'react-native-paper'
import HomeMenuItems from 'app/components/HomeMenuItems'
import CommentsReview from 'app/components/Review/CommentsReview'
import MenuContainer from 'app/components/MenuContainer'

const ReviewScreen: React.FC = () => {
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
      label: translate('comments'),
      name: 'Comments',
      component: CommentsReview,
    },
    {
      label: translate('chart'),
      name: 'Chart',
      component: () => (
        <ExerciseView
          openSelect={() => setExerciseSelectOpen(true)}
          isExerciseSelected={!!selectedExercise}
        >
          <ExerciseChartReview exercise={selectedExercise} />
        </ExerciseView>
      ),
    },
    {
      label: translate('records'),
      name: 'Records',
      component: () => (
        <ExerciseView
          openSelect={() => setExerciseSelectOpen(true)}
          isExerciseSelected={!!selectedExercise}
        >
          <ExerciseRecordReview exercise={selectedExercise} />
        </ExerciseView>
      ),
      props: { exercise: selectedExercise },
    },
    {
      label: translate('history'),
      name: 'History',
      component: () => (
        <ExerciseView
          openSelect={() => setExerciseSelectOpen(true)}
          isExerciseSelected={!!selectedExercise}
        >
          <ExerciseHistoryReview exercise={selectedExercise} />
        </ExerciseView>
      ),
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
              color={colors.onPrimary}
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
            color={colors.onPrimary}
          />
        </IconButton>

        <MenuContainer>
          {([menuVisible, setMenuVisible]) => (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchorPosition="bottom"
              anchor={
                <IconButton
                  onPress={() => setMenuVisible(true)}
                  underlay="darker"
                >
                  <Icon
                    icon="ellipsis-vertical"
                    color={colors.onPrimary}
                  />
                </IconButton>
              }
            >
              <HomeMenuItems onClose={() => setMenuVisible(false)} />
            </Menu>
          )}
        </MenuContainer>
      </Header>

      <View
        style={{
          flexGrow: 1,
          position: 'relative',
          backgroundColor: colors.surface,
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

        {!exerciseSelectOpen && (
          <SwipeTabs
            defaultIndex={defaultIndex}
            tabsConfig={tabsConfig}
            onTabChange={tab => {
              stateStore.setProp('reviewLastTab', tab)
            }}
          />
        )}
      </View>
    </>
  )
}

export default ReviewScreen
