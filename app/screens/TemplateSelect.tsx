import { observer } from 'mobx-react-lite'
import React from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { WorkoutTemplate } from 'app/db/models'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { Header, Icon, IconButton, useColors } from 'designSystem'
import TemplateList from 'app/components/WorkoutTemplate/TemplateList'
import { useDialogContext } from 'app/contexts/DialogContext'

const TemplateSelectScreen: React.FC = () => {
  const colors = useColors()

  const { workoutStore } = useStores()

  const { showConfirm } = useDialogContext()

  function handleSelect(template: WorkoutTemplate) {
    workoutStore.createWorkoutFromTemplate(template)
    navigate('Workout')
  }

  function handleEdit(template: WorkoutTemplate) {
    navigate('SaveTemplate', { edittingTemplate: template })
  }

  function handleDelete(template: WorkoutTemplate) {
    showConfirm!({
      message: translate('templateWillBeDeleted'),
      onClose: () => showConfirm!(undefined),
      onConfirm: () => {
        workoutStore.removeTemplate(template)
        showConfirm!(undefined)
      },
    })
  }

  function onBackPress() {
    navigate('Workout')
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
      </Header>

      <TemplateList
        onSelect={handleSelect}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </EmptyLayout>
  )
}
export default observer(TemplateSelectScreen)
