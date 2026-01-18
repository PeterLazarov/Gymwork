import { useDialogContext } from "@/context/DialogContext"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { useInsertWorkout, useRemoveWorkout, useTemplates } from "@/db/hooks"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { Header, Icon, IconButton, Text, spacing, useColors } from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { translate } from "@/utils"
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list"
import { useMemo } from "react"
import { Pressable, View } from "react-native"

interface TemplateSelectScreenProps extends AppStackScreenProps<"TemplateSelect"> {}

export const TemplateSelectScreen: React.FC<TemplateSelectScreenProps> = ({ navigation }) => {
  const colors = useColors()
  const { mutate: removeWorkout } = useRemoveWorkout()
  const { mutate: insertWorkout } = useInsertWorkout()
  const { showConfirm } = useDialogContext()
  const { openedDateMs } = useOpenedWorkout()

  function handleSelect(template: WorkoutModel) {
    insertWorkout({
      name: template.name,
      workoutSteps: template.workoutSteps,
      date: openedDateMs,
    })
    navigation.navigate("Workout")
  }

  function handleEdit(template: WorkoutModel) {
    navigation.navigate("TemplateSave", { edittingTemplate: template })
  }

  function handleDelete(template: WorkoutModel) {
    showConfirm?.({
      message: translate("templateWillBeDeleted"),
      onConfirm: () => {
        removeWorkout({ workoutId: template.id })
      },
    })
  }

  function onBackPress() {
    navigation.navigate("Workout")
  }

  return (
    <BaseLayout>
      <Header>
        <IconButton
          onPress={onBackPress}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
          />
        </IconButton>
        <Header.Title title={translate("selectTemplate")} />
      </Header>

      <TemplateList
        onSelect={handleSelect}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </BaseLayout>
  )
}

type TemplateListProps = {
  onSelect: (template: WorkoutModel) => void
  onDelete: (template: WorkoutModel) => void
  onEdit: (template: WorkoutModel) => void
}
const TemplateList: React.FC<TemplateListProps> = ({ onSelect, onDelete, onEdit }) => {
  const { data: rawTemplates } = useTemplates()

  const templates = useMemo(
    () => (rawTemplates ? rawTemplates.map((item) => new WorkoutModel(item)) : []), // TODO: fix error
    [rawTemplates],
  )

  const renderItem = ({ item }: ListRenderItemInfo<WorkoutModel>) => {
    return (
      <ListItem
        template={item}
        onSelect={onSelect}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    )
  }

  return (
    <FlashList
      data={templates}
      renderItem={renderItem}
      keyExtractor={(template) => template.id!.toString()}
    />
  )
}

type ListItemProps = {
  template: WorkoutModel
  onSelect: (template: WorkoutModel) => void
  onDelete: (template: WorkoutModel) => void
  onEdit: (template: WorkoutModel) => void
}
const ListItem: React.FC<ListItemProps> = ({ template, onSelect, onDelete, onEdit }) => {
  return (
    <Pressable onPress={() => onSelect(template)}>
      <View
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.md,
        }}
      >
        <Text
          style={{ flex: 1, flexWrap: "wrap" }}
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
    </Pressable>
  )
}
