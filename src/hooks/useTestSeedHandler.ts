import { useQueryClient } from "@tanstack/react-query"
import * as Linking from "expo-linking"
import { useEffect } from "react"

import { getTestSeedPreset } from "@/db/expo/testSeeds"
import { useDatabaseService } from "@/db/useDB"

const SEED_PATH_PREFIX = "test-seed/"
const IS_E2E = process.env.EXPO_PUBLIC_SKIP_WORKOUT_SEEDS === "true"

function parseSeedPreset(url: string): string | null {
  const parsed = Linking.parse(url)
  const fullPath = [parsed.hostname, parsed.path].filter(Boolean).join("/")
  if (!fullPath.startsWith(SEED_PATH_PREFIX)) return null
  return fullPath.slice(SEED_PATH_PREFIX.length)
}

/**
 * Listens for deep links matching `BodyBuilder://test-seed/<preset>`.
 * Only active in E2E mode (`EXPO_PUBLIC_SKIP_WORKOUT_SEEDS=true`).
 * Inserts test data via Drizzle, invalidates caches, and navigates to the target screen.
 */
export function useTestSeedHandler() {
  const queryClient = useQueryClient()
  const db = useDatabaseService()

  useEffect(() => {
    if (!IS_E2E) return

    async function handleSeedUrl(url: string) {
      const presetName = parseSeedPreset(url)
      if (!presetName) return

      const seedFn = getTestSeedPreset(presetName)
      if (!seedFn) {
        console.warn(`Unknown test seed preset: ${presetName}`)
        return
      }

      try {
        console.log(`🧪 Running test seed: ${presetName}`)

        const drizzle = db.getDrizzle()
        const result = await seedFn(drizzle)

        await queryClient.invalidateQueries()

        result.navigate()
        console.log(`Test seed complete: ${presetName}`)
      } catch (error) {
        console.error(`Test seed failed: ${presetName}`, error)
      }
    }

    const subscription = Linking.addEventListener("url", (event) => {
      console.log(`Linking 'url' event fired: ${event.url}`)
      handleSeedUrl(event.url)
    })

    Linking.getInitialURL().then((url) => {
      if (url) handleSeedUrl(url)
    })

    return () => subscription.remove()
  }, [queryClient, db])
}
