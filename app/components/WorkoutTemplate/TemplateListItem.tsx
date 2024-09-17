import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import { WorkoutTemplate } from 'app/db/models'
import { Text, Icon, IconButton, PressableHighlight } from 'designSystem'

type Props = {
  template: WorkoutTemplate
  onSelect: (template: WorkoutTemplate) => void
  onDelete: (template: WorkoutTemplate) => void
  onEdit: (template: WorkoutTemplate) => void
}
const ExerciseListItem: React.FC<Props> = ({
  template,
  onSelect,
  onDelete,
  onEdit,
}) => {
  return (
    <PressableHighlight onPress={() => onSelect(template)}>
      <View
        style={{
          width: '100%',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}
      >
        <Text
          style={{ flex: 1, flexWrap: 'wrap' }}
          numberOfLines={1}
        >
          {template.name}
        </Text>
        <IconButton onPress={() => onEdit(template)}>
          <Icon icon="pencil" />
        </IconButton>
        <IconButton onPress={() => onDelete(template)}>
          <Icon icon="delete" />
        </IconButton>
      </View>
    </PressableHighlight>
  )
}

export default observer(ExerciseListItem)
