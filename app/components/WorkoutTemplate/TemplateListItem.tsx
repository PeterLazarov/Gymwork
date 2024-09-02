import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Text } from 'react-native'

import { WorkoutTemplate } from 'app/db/models'
import { PressableHighlight, fontSize } from 'designSystem'

type Props = {
  template: WorkoutTemplate
  onSelect: (template: WorkoutTemplate) => void
}
const ExerciseListItem: React.FC<Props> = ({ template, onSelect }) => {
  return (
    <PressableHighlight onPress={() => onSelect(template)}>
      <View
        style={{
          width: '100%',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 15,
          paddingHorizontal: 15,
        }}
      >
        <Text
          style={{ fontSize: fontSize.md, flex: 1, flexWrap: 'wrap' }}
          numberOfLines={1}
        >
          {template.name}
        </Text>
      </View>
    </PressableHighlight>
  )
}

export default observer(ExerciseListItem)
