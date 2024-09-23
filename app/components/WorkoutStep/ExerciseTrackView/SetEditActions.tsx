import { translate } from 'app/i18n'
import { ButtonText, Button } from 'designSystem'
import { View } from 'react-native'

export type SetEditActionsProps = {
  mode: 'edit' | 'add'
  onUpdate(): void
  onAdd(): void
  onRemove(): void
}

export const SetEditActions: React.FC<SetEditActionsProps> = ({
  mode,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 2,
        paddingHorizontal: 8,
        backgroundColor: 'blue',
      }}
    >
      {mode === 'add' ? (
        <Button
          variant="primary"
          onPress={onAdd}
          style={{ flex: 1 }}
        >
          <ButtonText variant="primary">{translate('completeSet')}</ButtonText>
        </Button>
      ) : (
        <>
          <Button
            variant="primary"
            onPress={onUpdate}
            style={{ flex: 1 }}
          >
            <ButtonText variant="primary">{translate('updateSet')}</ButtonText>
          </Button>
          <Button
            variant="critical"
            onPress={onRemove}
            style={{ flex: 1 }}
          >
            <ButtonText variant="critical">{translate('remove')}</ButtonText>
          </Button>
        </>
      )}
    </View>
  )
}
