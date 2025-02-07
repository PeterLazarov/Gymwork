import {
  createNativeBottomTabNavigator,
  NativeBottomTabScreenProps,
} from '@bottom-tabs/react-navigation'
import MaterialIcons from '@react-native-vector-icons/material-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CompositeScreenProps } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ImageURISource } from 'react-native'
import { AppleIcon } from 'react-native-bottom-tabs'

import WorkoutHeaderRight from '@/components/Workout/WorkoutHeaderRight'
import { translate } from '@/i18n'
import * as Screens from '@/screens'
import { useAppTheme } from '@/utils/useAppTheme'

export type BottomTabParamList = {
  ReviewStack: undefined // TODO indicate top tab?
  WorkoutStack: undefined // TODO date?
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type BottomTabsScreenProps<T extends keyof BottomTabParamList> =
  CompositeScreenProps<
    // BottomTabScreenProps<BottomTabParamList, T>,
    NativeBottomTabScreenProps<BottomTabParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >

// const Tab = createBottomTabNavigator<BottomTabParamList>()
// TODO remove type-hack BS
// const Tab: ReturnType<typeof createBottomTabNavigator<BottomTabParamList>> =
//   createNativeBottomTabNavigator<BottomTabParamList>()

const Tab2 = createNativeBottomTabNavigator({
  screens: {
    Review: {
      screen: Screens.ReviewScreen,
    },
    Workout: Screens.WorkoutScreen,
  },
})

// export function BottomNavigator(): JSX.Element {
//   const {
//     // themed,
//     theme: { colors, isDark },
//   } = useAppTheme()

//   return (
//     <Tab.Navigator
//       key={String(isDark)} // rerender due to bug https://github.com/callstackincubator/react-native-bottom-tabs/issues/227
//       screenOptions={{
//         tabBarHideOnKeyboard: true,
//         tabBarActiveTintColor: colors.onSurface,
//         tabBarInactiveTintColor: colors.onSurface,
//       }}
//     >
//       <Tab.Screen
//         name="ReviewStack"
//         // component={Screens.ReviewScreen}
//         options={{
//           tabBarLabel: translate('review'),
//           tabBarIcon: ({ focused }) =>
//             MaterialIcons.getImageSourceSync('history', 24, 'black')!,
//         }}
//       >
//         {({ route, navigation }) => {
//           const ReviewStack = createNativeStackNavigator()

//           return (
//             <ReviewStack.Navigator
//               screenOptions={{
//                 headerBackVisible: false,
//                 headerTransparent: true,
//                 headerBlurEffect: 'regular',
//               }}
//             >
//               <ReviewStack.Screen
//                 name="Review"
//                 component={Screens.ReviewScreen}
//               />
//             </ReviewStack.Navigator>
//           )
//         }}
//       </Tab.Screen>

//       <Tab.Screen
//         name="WorkoutStack"
//         options={{
//           tabBarLabel: translate('workout'),
//           tabBarIcon: ({ focused }): ImageURISource | AppleIcon =>
//             MaterialIcons.getImageSourceSync('fitness-center', 24, 'black')!,
//         }}
//       >
//         {({ route, navigation }) => {
//           const WorkoutStack = createNativeStackNavigator()
//           return (
//             <WorkoutStack.Navigator
//               initialRouteName="Workout"
//               screenOptions={{
//                 headerBackVisible: false,
//                 headerTransparent: true,
//                 headerBlurEffect: 'regular',
//               }}
//             >
//               <WorkoutStack.Screen
//                 name="Workout"
//                 component={Screens.WorkoutScreen}
//                 options={{
//                   headerBackVisible: true,
//                   headerRight(props) {
//                     return <WorkoutHeaderRight />
//                   },
//                 }}
//               />
//               <WorkoutStack.Screen
//                 name="WorkoutStep"
//                 component={Screens.WorkoutStepScreen}
//                 options={{
//                   headerBackVisible: true,
//                 }}
//               />
//               <WorkoutStack.Screen
//                 name="WorkoutFeedback"
//                 component={Screens.WorkoutFeedbackScreen}
//                 options={{
//                   headerBackVisible: true,
//                 }}
//               />
//             </WorkoutStack.Navigator>
//           )
//         }}
//       </Tab.Screen>
//     </Tab.Navigator>
//   )
// }
