import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
// import { BlurView } from '@react-native-community/blur'

import { TabHeightCompensation } from '@/navigators/constants'
import { useAppTheme } from '@/utils/useAppTheme'
import { useStores } from 'app/db/helpers/useStores'
import { formatDate } from 'app/utils/date'
import { Icon, Text } from 'designSystem'
import { spacing } from 'designSystem/theme/spacing'

import AddStepMenu from './AddStepMenu'

export const WorkoutBottomControlsHeight = 72

const WorkoutBottomControls = () => {
  const { stateStore } = useStores()
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <View
      style={{
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.xs,
        // bottom: TabHeightCompensation,
        bottom: 0,
        backgroundColor: colors.surface, // TODO ios blur
        maxHeight: WorkoutBottomControlsHeight,
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
