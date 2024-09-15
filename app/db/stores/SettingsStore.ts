import { Instance, SnapshotOut, types, getParent } from 'mobx-state-tree'

import { ExerciseStore } from './ExerciseStore'
import { RootStore } from './RootStore'
import { WorkoutStore } from './WorkoutStore'
import { RecordStore } from './RecordStore'
import { Appearance, ColorSchemeName } from 'react-native'

let deviceColorScheme = Appearance.getColorScheme()
Appearance.addChangeListener(({ colorScheme }) => {
  deviceColorScheme = colorScheme
})

const colorSchemes = ['dark', 'light'] satisfies Array<ColorSchemeName>

export const SettingsStoreModel = types
  .model('SettingsStore')
  .props({
    colorSchemePreference: types.optional(
      types.maybeNull(types.maybe(types.enumeration(colorSchemes))),
      'light' // TODO rethink once we have dark mode set up
    ),
  })
  .views(self => ({
    get rootStore(): RootStore {
      return getParent(self) as RootStore
    },
    get exerciseStore(): ExerciseStore {
      return this.rootStore.exerciseStore
    },
    get workoutStore(): WorkoutStore {
      return this.rootStore.workoutStore
    },
    get recordStore(): RecordStore {
      return this.rootStore.recordStore
    },
  }))
  //   .actions(withSetPropAction)
  .actions(self => ({
    initialize() {
      Appearance.setColorScheme(self.colorSchemePreference)
    },

    //   null or undefined sets it to 'light'
    setColorSchemePreference(scheme: 'dark' | 'light' | null) {
      self.colorSchemePreference = scheme
      Appearance.setColorScheme(scheme ?? deviceColorScheme)
    },
  }))

export interface SettingsStoreModelStore
  extends Instance<typeof SettingsStoreModel> {}
export interface SettingsStoreModelStoreSnapshot
  extends SnapshotOut<typeof SettingsStoreModel> {}
