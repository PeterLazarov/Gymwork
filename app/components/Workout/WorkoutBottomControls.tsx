import { observer } from 'mobx-react-lite'
import React from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { formatDate } from 'app/utils/date'
import { Icon, Text, useColors } from 'designSystem'
import { TouchableOpacity, View } from 'react-native'
import AddStepMenu from './AddStepMenu'
import { DateTime } from 'luxon'

const WorkoutBottomControls = () => {
  const { stateStore } = useStores()
  const colors = useColors()

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
      }}
    >
      <TouchableOpacity
        onPress={stateStore.decrementCurrentDate}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Icon
            icon="chevron-back"
            color={colors.secondary}
          />
          <Text style={{ color: colors.secondary }}>
            {formatDate(
              DateTime.fromISO(stateStore.openedDate).minus({ day: 1 }),
              'short'
            )}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <AddStepMenu />
      </View>
      <TouchableOpacity
        onPress={stateStore.incrementCurrentDate}
        style={{
          alignItems: 'flex-end',
          flex: 1,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text style={{ color: colors.secondary }}>
            {formatDate(
              DateTime.fromISO(stateStore.openedDate).plus({ day: 1 }),
              'short'
            )}
          </Text>
          <Icon
            icon="chevron-forward"
            color={colors.secondary}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default observer(WorkoutBottomControls)
