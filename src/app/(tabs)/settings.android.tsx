import { View } from "react-native"
import { Switch } from "@expo/ui/jetpack-compose"

import { ListItem } from "@/components/Ignite/ListItem"
import { ListView } from "@/components/Ignite/ListView"
import { Screen } from "@/components/Ignite/Screen"
import { useAppTheme } from "@/theme/context"
import { DevControls } from "@/components/DevControls"

const data = [
  { text: "Profile", systemImage: "person" },
  { text: "Notifications", systemImage: "bell" },
  { text: "Privacy", systemImage: "lock" },
]

export default function SettingsScreen() {
  const { theme } = useAppTheme()

  return (
    <Screen safeAreaEdges={["top"]}>
      <View style={{ width: "50%", height: "100%" }}>
        <ListView
          data={data}
          estimatedItemSize={56}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => {
                //
              }}
              text={item.text}
              height={56}
              containerStyle={{
                paddingHorizontal: theme.spacing.md,
              }}
              RightComponent={
                <Switch
                  value={true}
                  onValueChange={(checked) => {
                    // setChecked(checked);
                  }}
                  style={{ alignSelf: "center" }}
                  variant="switch"
                />
              }
            />
          )}
        />
      </View>

      <DevControls />
    </Screen>
  )
}
