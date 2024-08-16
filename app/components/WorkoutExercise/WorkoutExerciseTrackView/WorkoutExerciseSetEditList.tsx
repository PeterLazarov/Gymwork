import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { FlatList, ListRenderItemInfo, View } from 'react-native'

import WorkoutExerciseSetEditItem from './WorkoutExerciseSetEditItem'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet } from 'app/db/models'
import { Divider } from 'designSystem'
import EmptyState from 'app/components/EmptyState'
import { translate } from 'app/i18n'

type Props = {
  selectedSet: WorkoutSet | null
  setSelectedSet: (set: WorkoutSet | null) => void
}

const WorkoutExerciseSetEditList: React.FC<Props> = ({
  selectedSet,
  setSelectedSet,
}) => {
  const { stateStore } = useStores()

  function toggleSelectedSet(set: WorkoutSet) {
    setSelectedSet(set.guid === selectedSet?.guid ? null : set)
  }

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<WorkoutSet>) => {
      return (
        <WorkoutExerciseSetEditItem
          set={item}
          isFocused={selectedSet?.guid === item.guid}
          onPress={() => toggleSelectedSet(item)}
        />
      )
    },
    [selectedSet]
  )
  const ITEM_HEIGHT = 62
  const getItemLayout = (
    data: ArrayLike<WorkoutSet> | null | undefined,
    index: number
  ) => {
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * (index + 1),
      index,
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={stateStore.openedExerciseSets}
        renderItem={renderItem}
        keyExtractor={set => set.guid}
        getItemLayout={getItemLayout}
        ItemSeparatorComponent={() => <Divider orientation="horizontal" />}
      />

      {stateStore.openedExerciseSets.length === 0 && (
        <EmptyState text={translate('noSetsEntered')} />
      )}
    </View>
  )
}

export default observer(WorkoutExerciseSetEditList)
