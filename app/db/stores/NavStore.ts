import { Instance, SnapshotOut, types } from 'mobx-state-tree'

import {
  AllStacksParamList,
  navigationRef,
  RoutesWithoutParams,
  RoutesWithParams,
} from 'app/navigators'

import { withSetPropAction } from '../helpers/withSetPropAction'

// TODO refactor so that it's not tightly and unknowingly coupled to actual nav
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
  'UserFeedback',
  'ExerciseDetails',
]

function navigate<T extends RoutesWithParams>(
  name: T,
  params: AllStacksParamList[T]
): void
function navigate<T extends RoutesWithoutParams>(name: T): void
function navigate<T extends RoutesWithParams | RoutesWithoutParams>(
  this: NavStore,
  name: T,
  params?: AllStacksParamList[T]
): void {
  try {
    if (navigationRef.isReady()) {
      // @ts-expect-error
      navigationRef.navigate(name as never, params as never)
      this.setProp('activeRoute', name)
    }
  } catch (error) {
    console.log('did throw in action')
    throw error
  }
}

export const NavStoreModel = types
  .model('NavigationStore')
  .props({
    activeRoute: types.maybe(types.enumeration(pages)),
    reviewLastTab: types.maybe(types.string),
    exerciseSelectLastTab: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .actions(self => ({
    initialize() {
      self.activeRoute = 'Workout'
    },

    /**
     * use this to navigate without the navigation
     * prop. If you have access to the navigation prop, do not use this.
     * @see {@link https://reactnavigation.org/docs/navigating-without-navigation-prop/}
     * @param name - The name of the route to navigate to.
     * @param params - The params to pass to the route.
     */
    navigate: navigate.bind(self),

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
