import { observer } from 'mobx-react-lite'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { WorkoutTemplate } from 'app/db/models'
import { Text, Icon, IconButton, spacing } from 'designSystem'

export type TemplateListItemProps = {
  template: WorkoutTemplate
  onSelect: (template: WorkoutTemplate) => void
  onDelete: (template: WorkoutTemplate) => void
  onEdit: (template: WorkoutTemplate) => void
}
const ExerciseListItem: React.FC<TemplateListItemProps> = ({
  template,
  onSelect,
  onDelete,
  onEdit,
}) => {
  return (
    <TouchableOpacity onPress={() => onSelect(template)}>
      <View
        style={{
          width: '100%',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.md,
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
    </TouchableOpacity>
  )
}

export default observer(ExerciseListItem)
