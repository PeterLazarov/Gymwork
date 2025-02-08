import { Alert, Share } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { useStores } from 'app/db/helpers/useStores'
import { Button, ButtonText, Icon } from 'designSystem'

export type ExportButtonProps = {
  createWorkout: () => void
}

export const ExportButton: React.FC<ExportButtonProps> = props => {
  const {
    theme: {
      colors,
      spacing,
      typography: { fontSize },
    },
  } = useAppTheme()

  const { workoutStore } = useStores()

  async function exportWorkouts() {
    try {
      const result = await Share.share({
        message: JSON.stringify(workoutStore),
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message)
    }
  }

  return (
    <Button
      variant="primary"
      onPress={exportWorkouts}
      style={{ flex: 1 }}
    >
      <Icon
        color={colors.onPrimary}
        icon="analytics"
      />
      <ButtonText variant="primary">Export workouts</ButtonText>
    </Button>
  )
}
