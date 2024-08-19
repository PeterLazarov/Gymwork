import { translate } from 'app/i18n'
import { ButtonText, Button } from 'designSystem'
import { View } from 'react-native'

export type WorkoutExerciseSetEditActionsProps = {
  mode: 'edit' | 'add'
  onUpdate(): void
  onAdd(): void
  onRemove(): void
}

export const WorkoutExerciseSetEditActions: React.FC<
  WorkoutExerciseSetEditActionsProps
> = ({ mode, onAdd, onRemove, onUpdate }) => {
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      <Button
        variant="primary"
        onPress={mode === 'edit' ? onUpdate : onAdd}
        style={{ flex: 1 }}
      >
        <ButtonText variant="primary">
          {mode === 'edit' ? translate('updateSet') : translate('addSet')}
        </ButtonText>
      </Button>
      {mode === 'edit' && (
        <Button
          variant="critical"
          onPress={onRemove}
          style={{ flex: 1 }}
        >
          <ButtonText variant="critical">{translate('remove')}</ButtonText>
        </Button>
      )}
    </View>
  )
}
