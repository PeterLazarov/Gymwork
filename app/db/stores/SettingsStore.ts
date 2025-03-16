import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { Appearance, ColorSchemeName } from 'react-native'
// import * as SystemUI from 'expo-system-ui'

import { withSetPropAction } from '../helpers/withSetPropAction'

const colorSchemes = ['dark', 'light'] satisfies ColorSchemeName[]
let deviceColorScheme = Appearance.getColorScheme()
 Appearance.addChangeListener(({ colorScheme }) => {
   deviceColorScheme = colorScheme
 })
 
export const SettingsStoreModel = types
  .model('SettingsStore')
  .props({
    colorSchemePreference: types.optional(
      types.maybe(types.maybe(types.enumeration(colorSchemes))),
      undefined
    ),
    measureRest: false,
    showCommentsCard: true,
    previewNextSet: false,
    showWorkoutTimer: true,

    // ! TODO Currenlty makes sense only for copyWorkout + includeSets!
    showSetCompletion: false,
  })
  .actions(withSetPropAction)
  .actions(self => ({
    initialize() {
      if (self.colorSchemePreference) {
        Appearance.setColorScheme?.(self.colorSchemePreference)
      }

      // const colorScheme = Appearance.getColorScheme()
      // const colors = getColors(colorScheme)

      // SystemUI.setBackgroundColorAsync(colors.surfaceContainerLow)
    },

    //   null or undefined sets it to 'light'
    setColorSchemePreference(scheme: 'dark' | 'light' | undefined) {
      self.colorSchemePreference = scheme
      Appearance.setColorScheme?.(scheme ?? deviceColorScheme)

      // const colorScheme = Appearance.getColorScheme()
      // const colors = getColors(colorScheme)

      // SystemUI.setBackgroundColorAsync(colors.surfaceContainerLow)
    },
    setMeasureRest(measureRest: boolean) {
      self.measureRest = measureRest
    },
  }))

export interface SettingsStore extends Instance<typeof SettingsStoreModel> {}
export interface SettingsStoreSnapshot
  extends SnapshotOut<typeof SettingsStoreModel> {}
