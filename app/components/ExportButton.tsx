import { useStores } from 'app/db/helpers/useStores'
import { useColors, ButtonText, Icon, Button } from 'designSystem'
import { Share, Alert } from 'react-native'

type Props = {
  createWorkout: () => void
}

export const ExportButton: React.FC<Props> = props => {
  const colors = useColors()

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
        color={colors.mat.onPrimary}
        icon="analytics"
      />
      <ButtonText variant="primary">Export workouts</ButtonText>
    </Button>
  )
}
