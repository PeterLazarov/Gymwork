import { Platform } from "react-native"
import MaterialIcons from "@react-native-vector-icons/material-icons"

import { NativeTabs } from "@/components/NativeTabs"

const homeIconSource = MaterialIcons.getImageSourceSync("home", 24, "black")!
const settingsIconSource = MaterialIcons.getImageSourceSync("settings", 24, "black")!
const reviewIconSource = MaterialIcons.getImageSourceSync("stacked-line-chart", 24, "black")!

export default function TabLayout() {
  return (
    <NativeTabs
      // tabBarActiveTintColor={"red"}
      // activeIndicatorColor={"brown"}
      // tabBarInactiveTintColor={"green"}
      translucent={true}
    >
      <NativeTabs.Screen
        name="review"
        options={{
          title: "Review",
          tabBarIcon: () =>
            Platform.OS === "ios" ? { sfSymbol: "chart.line.uptrend.xyaxis" } : reviewIconSource,
        }}
      />

      <NativeTabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => (Platform.OS === "ios" ? { sfSymbol: "house" } : homeIconSource),
        }}
      />

      <NativeTabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: () =>
            Platform.OS === "ios" ? { sfSymbol: "gearshape" } : settingsIconSource,
        }}
      />
    </NativeTabs>
  )
}
