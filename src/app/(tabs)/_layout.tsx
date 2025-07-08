import { Platform } from "react-native"
import MaterialIcons from "@react-native-vector-icons/material-icons"

import { NativeTabs } from "@/components/NativeTabs"

const homeIconSource = MaterialIcons.getImageSourceSync("home", 24, "black")!

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () =>
            Platform.select({
              ios: { sfSymbol: "house" },
              android: homeIconSource,
              // default: homeIconSource,
            }),
        }}
      />
      {/* <NativeTabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: () => ({ sfSymbol: "person" }),
        }}
      /> */}
    </NativeTabs>
  )
}
