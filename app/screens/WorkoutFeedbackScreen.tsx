import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'

import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import {
  Header,
  Icon,
  IconButton,
  useColors,
  Button,
  ButtonText,
} from 'designSystem'
import WorkoutCommentsForm from 'app/components/WorkoutCommentsForm'
import { WorkoutComments } from 'app/db/models'
import { useDialogContext } from 'app/contexts/DialogContext'

export const WorkoutFeedbackScreen: React.FC = observer(() => {
  const colors = useColors()

  const {
    stateStore,
    navStore: { goBack },
  } = useStores()
  const workout = stateStore.openedWorkout

  if (!workout) {
    console.warn('REDIRECT - No workout')
    goBack()
    return null
  }

  const { showConfirm } = useDialogContext()
  const [comments, setComments] = useState<WorkoutComments>(workout?.comments)

  function onBackPress() {
    showConfirm?.({
      message: translate('changesWillBeLost'),
      onClose: () => showConfirm?.(undefined),
      onConfirm: onBackConfirmed,
    })
  }

  function onBackConfirmed() {
    showConfirm?.(undefined)
    goBack()
  }

  function onCommentsSave() {
    workout?.saveComments(comments)
    goBack()
  }

  return (
    <>
      <Header>
        <IconButton
          onPress={onBackPress}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
          />
        </IconButton>
        <Header.Title title={translate('workoutComments')} />
        <IconButton
          onPress={onCommentsSave}
          underlay="darker"
        >
          <Icon
            icon="checkmark"
            size="large"
            color={colors.onPrimary}
          />
        </IconButton>
      </Header>

      <WorkoutCommentsForm
        comments={comments}
        onUpdate={setComments}
      />

      <Button
        variant="primary"
        onPress={onCommentsSave}
      >
        <ButtonText variant="primary">{translate('save')}</ButtonText>
      </Button>
    </>
  )
})
