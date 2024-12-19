import { observer } from 'mobx-react-lite'
import React from 'react'

import { useAppTheme } from '@/utils/useAppTheme'
import TemplateList from 'app/components/WorkoutTemplate/TemplateList'
import { useDialogContext } from 'app/contexts/DialogContext'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutTemplate } from 'app/db/models'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { Header, Icon, IconButton } from 'designSystem'

export const TemplateSelectScreen: React.FC = observer(() => {
  const {
    theme: { colors },
  } = useAppTheme()

  const {
    workoutStore,
    navStore: { navigate },
  } = useStores()

  const { showConfirm } = useDialogContext()

  function handleSelect(template: WorkoutTemplate) {
    workoutStore.createWorkoutFromTemplate(template)
    navigate('WorkoutStack', { screen: 'Workout' })
  }

  function handleEdit(template: WorkoutTemplate) {
    navigate('SaveTemplate', { edittingTemplate: template })
  }

  function handleDelete(template: WorkoutTemplate) {
    showConfirm?.({
      message: translate('templateWillBeDeleted'),
      onClose: () => showConfirm?.(undefined),
      onConfirm: () => {
        workoutStore.removeTemplate(template)
        showConfirm?.(undefined)
      },
    })
  }

  function onBackPress() {
    navigate('WorkoutStack', { screen: 'Workout' })
  }

  return (
    <EmptyLayout>
      <Header>
        <IconButton
          onPress={onBackPress}
          //
        >
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
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
})
