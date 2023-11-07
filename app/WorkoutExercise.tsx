import {
  Tabs,
  TabsTabList,
  TabsTab,
  TabsTabTitle,
  TabsTabPanels,
  TabsTabPanel,
} from '@gluestack-ui/themed'
import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Text, View } from 'react-native'

import WorkoutExerciseEntry from '../components/WorkoutExerciseEntry'
import WorkoutExerciseHistory from '../components/WorkoutExerciseHistory'
import { useStores } from '../db/helpers/useStores'
import { Icon, IconButtonContainer } from '../designSystem'

const WorkoutExercisePage: React.FC = () => {
  const { workoutStore } = useStores()
  const router = useRouter()

  function onOptionsPress() {
    throw new Error('Function not implemented.')
  }

  function onBackPress() {
    router.push('/')
    workoutStore.setOpenedExercise(null)
  }

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          // justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconButtonContainer onPress={onBackPress}>
          <Icon icon="chevron-back" />
        </IconButtonContainer>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            flex: 1,
          }}
        >
          {workoutStore.openedExercise?.exercise.name}
        </Text>

        <IconButtonContainer onPress={onOptionsPress}>
          <Icon icon="ellipsis-vertical" />
        </IconButtonContainer>
      </View>
      <Tabs value="track">
        <TabsTabList>
          <TabsTab value="track">
            <TabsTabTitle>Track</TabsTabTitle>
          </TabsTab>
          <TabsTab value="history">
            <TabsTabTitle>History</TabsTabTitle>
          </TabsTab>
        </TabsTabList>
        <TabsTabPanels>
          <TabsTabPanel value="track">
            <WorkoutExerciseEntry exercise={workoutStore.openedExercise!} />
          </TabsTabPanel>
          <TabsTabPanel value="history">
            <WorkoutExerciseHistory exercise={workoutStore.openedExercise!} />
          </TabsTabPanel>
        </TabsTabPanels>
      </Tabs>
    </View>
  )
}
export default observer(WorkoutExercisePage)
