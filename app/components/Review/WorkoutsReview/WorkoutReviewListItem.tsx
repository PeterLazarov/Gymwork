import { observer } from 'mobx-react-lite'
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'

import { MuscleMap } from '@/components/MuscleMap/MuscleMap'
import { translate } from '@/i18n'
import { useAppTheme } from '@/utils/useAppTheme'
import { discomfortOptions, Workout } from 'app/db/models'
import { formatDateIso } from 'app/utils/date'
import { Text, ThemedStyle } from 'designSystem'
import { palettes } from 'designSystem/theme/colors'

type WorkoutReviewListItemProps = {
  workout: Workout
  onPress: () => void
}

const WorkoutReviewListItem: React.FC<WorkoutReviewListItemProps> = ({
  workout,
  onPress,
}) => {
  const { theme, themed } = useAppTheme()
  return (
    <TouchableOpacity
      onPress={onPress}
      style={themed($container)}
    >
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={themed($title)}>
              {formatDateIso(workout.date, 'long')}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                height: 80,
                width: 60,
              }}
            >
              <MuscleMap
                muscles={workout.muscles}
                back={false}
                activeColor={palettes.gold['80']}
                inactiveColor={theme.colors.outline}
                baseColor={theme.colors.shadow}
              />
            </View>
            <View
              style={{
                height: 80,
                width: 60,
              }}
            >
              <MuscleMap
                muscles={workout.muscles}
                back={true}
                activeColor={palettes.gold['80']}
                inactiveColor={theme.colors.outline}
                baseColor={theme.colors.shadow}
              />
            </View>
          </View>
        </View>
      </View>

      {/* 3col */}
      <View style={{ flex: 1, gap: theme.spacing.xs, flexDirection: 'row' }}>
        {workout.duration !== undefined && (
          <View style={themed($surface)}>
            <Text
              numberOfLines={1}
              style={themed($surfaceTitle)}
            >
              {translate('duration')}
            </Text>

            <Text
              numberOfLines={1}
              style={themed($surfaceBodyBold)}
            >
              {translate('durationMinutes' as any, {
                count: Math.ceil(workout.duration?.as('minutes')),
              })}
            </Text>
          </View>
        )}

        {workout.rpe && (
          <View style={themed($surface)}>
            <Text
              numberOfLines={1}
              style={themed($surfaceTitle)}
            >
              {translate('difficulty')}
            </Text>
            <Text
              numberOfLines={1}
              style={themed($surfaceBodyBold)}
            >
              {translate('diffValue', { rpe: workout.rpe })}
            </Text>
          </View>
        )}

        {workout.pain && (
          <View style={themed($surface)}>
            <Text
              numberOfLines={1}
              style={themed($surfaceTitle)}
            >
              {translate('discomfort')}
            </Text>

            <Text
              numberOfLines={1}
              style={themed($surfaceBodyBold)}
            >
              {discomfortOptions[workout.pain].label}
            </Text>
          </View>
        )}
      </View>

      {workout.comments.notes.length > 0 && (
        <View style={themed($surface)}>
          <Text>{workout.comments.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const $container: ThemedStyle<ViewStyle> = theme => ({
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  padding: theme.spacing.xs,
  gap: theme.spacing.sm,
  backgroundColor: theme.colors.background,
})

const $title: ThemedStyle<TextStyle> = theme => ({
  fontSize: theme.typography.fontSize.lg,
  fontWeight: '500',
  marginLeft: theme.spacing.sm,
  textAlign: 'center',
})

const $surface: ThemedStyle<ViewStyle> = theme => ({
  backgroundColor: theme.colors.surfaceContainer,
  borderRadius: theme.spacing.sm,
  padding: theme.spacing.sm,
  flex: 1,
})

const $surfaceTitle: ThemedStyle<TextStyle> = theme => ({
  fontSize: theme.typography.fontSize.xs,
  color: theme.colors.onSurfaceVariant,
  textTransform: 'capitalize',
})

const $surfaceBodyBold: ThemedStyle<TextStyle> = theme => ({
  fontSize: theme.typography.fontSize.sm,
  fontWeight: '500',
  color: theme.colors.onSurface,
})

export default observer(WorkoutReviewListItem)
