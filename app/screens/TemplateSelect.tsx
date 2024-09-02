import { observer } from 'mobx-react-lite'
import React from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { WorkoutTemplate } from 'app/db/models'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import { Header, Icon, IconButton, colors } from 'designSystem'
import TemplateList from 'app/components/WorkoutTemplate/TemplateList'

const TemplateSelectScreen: React.FC = () => {
  const { workoutStore } = useStores()

  function handleSelect(template: WorkoutTemplate) {
    workoutStore.createWorkoutFromTemplate(template)
    navigate('Workout')
  }

  function onBackPress() {
    navigate('Workout')
  }

  function onAddExercisePress() {
    navigate('ExerciseCreate')
  }

  return (
    <EmptyLayout>
      <Header>
        <IconButton
          onPress={onBackPress}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.primaryText}
          />
        </IconButton>
        <Header.Title title={translate('selectTemplate')} />
        <IconButton
          onPress={onAddExercisePress}
          underlay="darker"
        >
          <Icon
            icon="add"
            size="large"
            color={colors.primaryText}
          />
        </IconButton>
      </Header>

      <TemplateList onSelect={handleSelect} />
    </EmptyLayout>
  )
}
export default observer(TemplateSelectScreen)
