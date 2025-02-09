import { useNavigation, type StaticScreenProps } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import React from 'react'

import { useAppTheme } from '@/utils/useAppTheme'
import TemplateList from 'app/components/WorkoutTemplate/TemplateList'
import { useDialogContext } from 'app/contexts/DialogContext'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutTemplate } from 'app/db/models'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { HeaderRight, HeaderTitle, Icon, IconButton } from 'designSystem'

export type TemplateSelectScreenProps = StaticScreenProps<{}>

export const TemplateSelectScreen: React.FC<TemplateSelectScreenProps> =
  observer(() => {
    const {
      theme: { colors },
    } = useAppTheme()

    const { navigate } = useNavigation()

    const { workoutStore } = useStores()

    const { showConfirm } = useDialogContext()

    function handleSelect(template: WorkoutTemplate) {
      workoutStore.createWorkoutFromTemplate(template)
      navigate('Home', {
        screen: 'WorkoutStack',
        params: { screen: 'Workout', params: {} },
      })
    }

    function handleEdit(template: WorkoutTemplate) {
      navigate('Home', {
        screen: 'WorkoutStack',
        params: {
          screen: 'SaveTemplate',
          params: { edittingTemplate: template },
        },
      })
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

    return (
      <EmptyLayout>
        <HeaderRight>
          <HeaderTitle title={translate('selectTemplate')} />
        </HeaderRight>

        <TemplateList
          onSelect={handleSelect}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </EmptyLayout>
    )
  })
