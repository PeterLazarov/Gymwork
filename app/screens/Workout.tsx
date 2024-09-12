import { observer } from 'mobx-react-lite'
import React from 'react'

import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import WorkoutHeader from 'app/components/Workout/WorkoutHeader'
import WorkoutHorizontalList from 'app/components/Workout/WorkoutHorizontalList'
import { useStores } from 'app/db/helpers/useStores'

const WorkoutPageScreen: React.FC = () => {
  const { stateStore } = useStores()
  return (
    <EmptyLayout>
      <>
        <WorkoutHeader />

        <WorkoutHorizontalList />
      </>
    </EmptyLayout>
  )
}
export default observer(WorkoutPageScreen)
