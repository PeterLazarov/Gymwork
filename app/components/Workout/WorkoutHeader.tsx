import { observer } from 'mobx-react-lite'
import React from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { formatDateIso } from 'app/utils/date'
import { Header } from 'designSystem'

import WorkoutHeaderRight from './WorkoutHeaderRight'

const WorkoutHeader: React.FC = () => {
  const { stateStore } = useStores()

  const dateLabel = formatDateIso(stateStore.openedDate, 'long')

  return (
    <Header>
      <Header.Title title={dateLabel} />

      <WorkoutHeaderRight />
    </Header>
  )
}

export default observer(WorkoutHeader)
