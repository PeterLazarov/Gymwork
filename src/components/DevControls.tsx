import { View } from "react-native"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { clearAll, seedAll } from "@/db/sqlite/expo/expoSeeder"
import { useDB } from "@/db/useDB"

import { Button } from "./Ignite/Button"

export function DevControls() {
  const { drizzleDB } = useDB()
  const { data: workouts } = useLiveQuery(
    drizzleDB.query.workouts.findMany({ columns: { id: true } }),
  )

  return (
    <View>
      {workouts.length ? (
        <Button
          text="clear db"
          onPress={() => {
            clearAll(drizzleDB)
          }}
        />
      ) : (
        <Button
          text="seed db"
          onPress={() => {
            seedAll(drizzleDB)
          }}
        />
      )}
    </View>
  )
}
