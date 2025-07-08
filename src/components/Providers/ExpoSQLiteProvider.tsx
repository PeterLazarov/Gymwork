import { Suspense } from "react"
import { ActivityIndicator } from "react-native"
import { SQLiteProvider } from "expo-sqlite"

import { SQLiteDBName } from "@/db/sqlite/constants"

import DrizzleProvider from "./DrizzleProvider"

export default function ExpoSQLiteProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={SQLiteDBName}
        useSuspense
        options={{ enableChangeListener: true }}
        assetSource={{
          assetId: require(`../../../assets/db/db.db`),
        }}
      >
        <DrizzleProvider>{children}</DrizzleProvider>
      </SQLiteProvider>
    </Suspense>
  )
}
