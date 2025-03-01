import { useNavigation, usePreventRemove } from '@react-navigation/native'
import type { StaticScreenProps } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'

import { Screen } from '@/components/ignite'
import { useAppTheme } from '@/utils/useAppTheme'
import WorkoutCommentsForm from 'app/components/WorkoutCommentsForm'
import { useDialogContext } from 'app/contexts/DialogContext'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutComments } from 'app/db/models'
import { translate } from 'app/i18n'
import { Button, ButtonText, Icon, IconButton, spacing } from 'designSystem'

export type WorkoutFeedbackScreenProps = StaticScreenProps<{}>

export const WorkoutFeedbackScreen: React.FC<WorkoutFeedbackScreenProps> =
  observer(() => {
    const {
      theme: { colors },
    } = useAppTheme()

    const { goBack } = useNavigation()

    const { stateStore } = useStores()
    const workout = stateStore.openedWorkout

    if (!workout) {
      console.warn('REDIRECT - No workout')
      goBack()
      return null
    }

    const { showConfirm } = useDialogContext()
    const [comments, setComments] = useState<WorkoutComments>(workout?.comments)
    const hasChanges = useRef(false)

    usePreventRemove(hasChanges.current, ({ data }) => {
      if (!hasChanges.current) {
        // TODO: useState on Save clisk isn't detected. Refactor so this condition is removed
        navigation.dispatch(data.action)
      } else {
        // Prompt the user before leaving the screen
        Alert.alert(translate('warning'), translate('changesWillBeLost'), [
          {
            text: translate('cancel'),
            style: 'default',
            isPreferred: true,
            onPress: () => {
              // Do nothing
            },
          },
          {
            text: translate('confirm'),
            style: 'destructive',
            onPress: () => navigation.dispatch(data.action),
          },
        ])
      }
    })

    function onCommentsSave() {
      hasChanges.current = false
      workout?.saveComments(comments)
      goBack()
    }

    const navigation = useNavigation()
    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <IconButton onPress={onCommentsSave}>
            <Icon
              icon="checkmark"
              size="large"
              color={colors.onPrimary}
            />
          </IconButton>
        ),
      })
    }, [navigation])

    return (
      <Screen
        safeAreaEdges={['top']}
        contentContainerStyle={{
          flex: 1,
          paddingBottom: spacing.md,
        }}
      >
        <WorkoutCommentsForm
          comments={comments}
          onUpdate={comments => {
            setComments(comments)
            hasChanges.current = true
          }}
        />

        <Button
          variant="primary"
          onPress={onCommentsSave}
        >
          <ButtonText variant="primary">{translate('save')}</ButtonText>
        </Button>
      </Screen>
    )
  })
