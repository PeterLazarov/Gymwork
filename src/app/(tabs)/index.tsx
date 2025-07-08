import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { Button } from "@/components/Ignite/Button"
import { Screen } from "@/components/Ignite/Screen"
import { Text } from "@/components/Ignite/Text"
import { clearAll, seedAll } from "@/db/sqlite/expo/expoSeeder"
import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"

export default function Index() {
  const theme = useAppTheme()
  const { drizzleDB } = useDB()
  const { data: workouts } = useLiveQuery(
    drizzleDB.query.workouts.findMany({ columns: { id: true } }),
  )

  return (
    <Screen>
      <Text>TODO?</Text>

      <Button
        text="print theme"
        onPress={() => {
          console.log(theme)
        }}
      />

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
    </Screen>
  )
}
