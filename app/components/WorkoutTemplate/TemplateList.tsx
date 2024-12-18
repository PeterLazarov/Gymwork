import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { observer } from 'mobx-react-lite'
import React from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { WorkoutTemplate } from 'app/db/models'

import TemplateListItem from './TemplateListItem'

type Props = {
  onSelect: (template: WorkoutTemplate) => void
  onDelete: (template: WorkoutTemplate) => void
  onEdit: (template: WorkoutTemplate) => void
}
const TemplateList: React.FC<Props> = ({ onSelect, onDelete, onEdit }) => {
  const { workoutStore } = useStores()
  const templates = workoutStore.workoutTemplates

  const renderItem = ({ item }: ListRenderItemInfo<WorkoutTemplate>) => {
    return (
      <TemplateListItem
        template={item}
        onSelect={onSelect}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    )
  }

  return (
    <FlashList
      data={templates.slice()}
      renderItem={renderItem}
      keyExtractor={template => template.guid}
      estimatedItemSize={69}
    />
  )
}

export default observer(TemplateList)
