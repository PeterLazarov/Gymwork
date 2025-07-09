import { Redirect } from "expo-router"

import { Screen } from "@/components/Ignite/Screen"

export default function LandingScreen() {
  console.log("redirecting")
  return (
    <Screen safeAreaEdges={["top"]}>
      <Redirect href={"/(tabs)/home"}></Redirect>
    </Screen>
  )
}
