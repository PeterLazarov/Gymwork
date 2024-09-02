import React from 'react'

import { WorkoutTemplate } from 'app/db/models'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import TemplateListItem from './TemplateListItem'
import { observer } from 'mobx-react-lite'
import { useStores } from 'app/db/helpers/useStores'

type Props = {
  onSelect: (template: WorkoutTemplate) => void
}
const TemplateList: React.FC<Props> = ({ onSelect }) => {
  const { workoutStore } = useStores()
  const templates = workoutStore.workoutTemplates

  const renderItem = ({ item }: ListRenderItemInfo<WorkoutTemplate>) => {
    return (
      <TemplateListItem
        template={item}
        onSelect={onSelect}
      />
    )
  }

  return (
    <FlashList
      data={templates}
      renderItem={renderItem}
      keyExtractor={template => template.guid}
      estimatedItemSize={69}
    />
  )
}

export default observer(TemplateList)
