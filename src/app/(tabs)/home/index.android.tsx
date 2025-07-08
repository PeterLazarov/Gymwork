import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { Button } from "@/components/Ignite/Button"
import { Screen } from "@/components/Ignite/Screen"
import { Text } from "@/components/Ignite/Text"
import { clearAll, seedAll } from "@/db/sqlite/expo/expoSeeder"
import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"

export default function Home() {
  const { drizzleDB } = useDB()

  return (
    <Screen>
      <Text>TODO?</Text>
    </Screen>
  )
}
