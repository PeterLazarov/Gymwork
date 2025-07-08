import { Stack } from "expo-router"

export default function HomeStack() {
  return (
    <Stack
      screenOptions={{
        // headerStyle: {
        //   backgroundColor: "#f4511e",
        // },
        title: "Home",
        // headerTintColor: "#fff",
        // headerTitleStyle: {
        //   fontWeight: "bold",
        // },
      }}
    >
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="home" options={{}} />
    </Stack>
  )
}
