import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { WorkoutTemplate } from 'app/db/models'
import { navigate } from 'app/navigators'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { Header, Icon, IconButton, colors } from 'designSystem'
import TemplateList from 'app/components/WorkoutTemplate/TemplateList'
import ConfirmationDialog from 'app/components/ConfirmationDialog'

const TemplateSelectScreen: React.FC = () => {
  const { workoutStore } = useStores()

  const [templateToDelete, setTemplateToDelete] =
    useState<WorkoutTemplate | null>(null)

  function handleSelect(template: WorkoutTemplate) {
    workoutStore.createWorkoutFromTemplate(template)
    navigate('Workout')
  }

  function handleEdit(template: WorkoutTemplate) {
    navigate('SaveTemplate', { edittingTemplate: template })
  }

  function handleDelete(template: WorkoutTemplate) {
    setTemplateToDelete(template)
  }

  function deleteTemplate() {
    workoutStore.removeTemplate(templateToDelete!)
    setTemplateToDelete(null)
  }

  function onBackPress() {
    navigate('Workout')
  }

  return (
    <>
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

      <ConfirmationDialog
        open={!!templateToDelete}
        message={translate('templateWillBeDeleted')}
        onClose={() => setTemplateToDelete(null)}
        onConfirm={deleteTemplate}
      />
    </>
  )
}
export default observer(TemplateSelectScreen)
