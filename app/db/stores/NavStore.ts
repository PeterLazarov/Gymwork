import { Instance, onAction, SnapshotOut, types } from 'mobx-state-tree'

import { AllStacksParamList, navigationRef } from 'app/navigators'
import { simpleActionLogger } from 'mst-middlewares'
import { withSetPropAction } from '../helpers/withSetPropAction'

const pages: (keyof AllStacksParamList)[] = [
  'Calendar',
  'ExerciseEdit',
  'ExerciseSelect',
  'SaveTemplate',
  'TemplateSelect',
  'HomeStack',
  'Settings',

  'Review',
  'WorkoutStack',

  'Workout',
  'WorkoutStep',
  'WorkoutFeedback',
]

export const NavStoreModel = types
  .model('NavigationStore')
  .props({
    activeRoute: types.maybe(types.enumeration(pages)),
  })
  .actions(withSetPropAction)
  .actions(self => ({
    // initialize() {
    //   //
    // },

    /**
     * use this to navigate without the navigation
     * prop. If you have access to the navigation prop, do not use this.
     * @see {@link https://reactnavigation.org/docs/navigating-without-navigation-prop/}
     * @param name - The name of the route to navigate to.
     * @param params - The params to pass to the route.
     */
    navigate<T extends keyof AllStacksParamList>(
      name: T,
      params?: AllStacksParamList[T]
    ) {
      try {
        if (navigationRef.isReady()) {
          // @ts-expect-error
          navigationRef.navigate(name as never, params as never)
        }
      } catch (error) {
        console.log('did throw in action')
        throw error
      }
    },

    /**
     * This function is used to go back in a navigation stack, if it's possible to go back.
     * If the navigation stack can't go back, nothing happens.
     * The navigationRef variable is a React ref that references a navigation object.
     * The navigationRef variable is set in the App component.
     */
    goBack() {
      if (navigationRef.isReady() && navigationRef.canGoBack()) {
        navigationRef.goBack()
      }
    },

    /**
     * resetRoot will reset the root navigation state to the given params.
     * @param {Parameters<typeof navigationRef.resetRoot>[0]} state - The state to reset the root to.
     * @returns {void}
     */
    resetRoot(
      state: Parameters<typeof navigationRef.resetRoot>[0] = {
        index: 0,
        routes: [],
      }
    ): void {
      if (navigationRef.isReady()) {
        navigationRef.resetRoot(state)
      }
    },
  }))

export interface NavStore extends Instance<typeof NavStoreModel> {}
export interface NavStoreSnapshot extends SnapshotOut<typeof NavStoreModel> {}
