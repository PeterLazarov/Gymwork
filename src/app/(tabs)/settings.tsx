import {
  Button as SwiftButton,
  Label,
  Section,
  List,
  LabelPrimitive,
  Button,
  ButtonPrimitive,
  Switch,
} from "@expo/ui/swift-ui"

import { Screen } from "@/components/Ignite/Screen"
import { Text } from "@/components/Ignite/Text"

export default function SettingsScreen() {
  // Define placeholder values for the required variables
  const editModeEnabled = false
  const moveEnabled = false
  const deleteEnabled = false
  const selectEnabled = true
  const color = "black"

  const data = [
    { text: "Profile", systemImage: "person" },
    { text: "Notifications", systemImage: "bell" },
    { text: "Privacy", systemImage: "lock" },
  ]

  return (
    <Screen safeAreaEdges={["top"]} style={{ backgroundColor: "gray" }}>
      <List
        scrollEnabled={false}
        editModeEnabled={editModeEnabled}
        onSelectionChange={(items) => alert(`indexes of selected items: ${items.join(", ")}`)}
        moveEnabled={moveEnabled}
        onMoveItem={(from, to) => alert(`moved item at index ${from} to index ${to}`)}
        onDeleteItem={(item) => alert(`deleted item at index: ${item}`)}
        style={{ minHeight: "100%" }}
        listStyle="automatic"
        deleteEnabled={deleteEnabled}
        selectEnabled={selectEnabled}
      >
        {data.map((item, index) => (
          <Switch
            key={index}
            value={false}
            onValueChange={(checked) => {
              // setChecked(checked)
            }}
            label={item.text}
            variant="switch"
          />
        ))}
      </List>
    </Screen>
  )
}
