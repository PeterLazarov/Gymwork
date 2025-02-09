import { MenuView } from '@react-native-menu/menu'
import { useNavigation } from '@react-navigation/native'
import { useMemo } from 'react'

import { Icon, IconButton } from 'designSystem'

// For dev purposes
export const Links: React.FC = () => {
  const nav = useNavigation()

  const links = useMemo(() => {
    const obj: Record<string, Parameters<typeof nav.navigate>[0]> = {
      Welcome: { name: 'Welcome', params: {} },
      Review: { name: 'Home', params: { screen: 'ReviewStack' } },
      Workout: { name: 'Home', params: { screen: 'WorkoutStack' } },
      Settings: { name: 'Settings', params: {} },
      // ExerciseSelect: {
      //   name: 'ExerciseSelect',
      //   params: { selectMode: 'straightSet' },
      // },
      ExerciseEdit: {
        name: 'ExerciseEdit',
        params: {
          exerciseId: 'e_animatic?_Ab Wheel Rollout',
          createMode: true,
        },
      },
      ExerciseDetails: {
        name: 'ExerciseDetails',
        params: { exerciseId: 'e_animatic?_Ab Wheel Rollout' },
      },
      UserFeedback: {
        name: 'UserFeedback',
        params: { referrerPage: 'dev' },
      },
    }
    return obj
  }, [])
  function handleMenuPress(actionID: string) {
    const args = links[actionID]
    nav.navigate(args)
  }

  return (
    <MenuView
      onPressAction={({ nativeEvent }) => {
        handleMenuPress(nativeEvent.event)
      }}
      actions={Object.keys(links).map(k => ({ title: k, id: k }))}
      shouldOpenOnLongPress={false}
    >
      <IconButton>
        <Icon
          icon="ellipsis-vertical"
          color={'green'}
        />
      </IconButton>
    </MenuView>
  )
}
