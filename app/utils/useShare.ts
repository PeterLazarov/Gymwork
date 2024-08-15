import { Share, Alert } from 'react-native'

export function useShare() {
  return async function exportWorkouts(value: any) {
    try {
      const result = await Share.share({
        message: JSON.stringify(value),
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
}
