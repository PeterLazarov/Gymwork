import { List, Switch } from "@expo/ui/swift-ui"

import { DevControls } from "@/components/DevControls"
import { Screen } from "@/components/Ignite/Screen"

export default function SettingsScreen() {
  // Define placeholder values for the required variables
  const editModeEnabled = false
  const moveEnabled = false
  const deleteEnabled = false
  const selectEnabled = true

  const data = [
    { text: "Track Rest", description: "Rest tracking lalala" },
    {
      text: "Track RPE",
      description:
        "RPE (Rated Percieved Exertion) is a measure of difficulty. 10 means you had nothing left in the tank.",
    },
    {
      text: "Track Workout Duration",
      description:
        "Workout duration starts upon completion of the first set and ends at the last one",
    },
    {
      text: "Show Scientific Muscle Names",
      description:
        "Workout duration starts upon completion of the first set and ends at the last one",
    },
  ]

  return (
    <Screen safeAreaEdges={["top"]}>
      <List
        scrollEnabled={false}
        editModeEnabled={editModeEnabled}
        onSelectionChange={(items) => alert(`indexes of selected items: ${items.join(", ")}`)}
        moveEnabled={moveEnabled}
        onMoveItem={(from, to) => alert(`moved item at index ${from} to index ${to}`)}
        onDeleteItem={(item) => alert(`deleted item at index: ${item}`)}
        style={{ minHeight: "50%" }}
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
            label={item.text + item.description}
            variant="switch"
            // style={{ flex: 1, width: 300, height: 50 }}
          />
        ))}
      </List>

      <DevControls />
    </Screen>
  )
}
