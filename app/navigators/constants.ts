import { Platform } from 'react-native'

// on iOS, the tabs float over the content. This is added as padding to compensate
export const TabHeightCompensation =
  Platform.select({
    ios: 83,
    android: 0, // TODO determine if thats really it
  }) ?? 0
