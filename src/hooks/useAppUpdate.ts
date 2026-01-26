import { useSetting } from "@/context/SettingContext"
import { airtableApi, AirtableRelease } from "@/integrations/airtable"
import Constants from "expo-constants"
import { useCallback, useEffect, useState } from "react"
import { Linking, Platform } from "react-native"
import { compare, valid } from "semver"

const PLAY_STORE_URL = "market://details?id=com.gymwork"
const PLAY_STORE_WEB_URL = "https://play.google.com/store/apps/details?id=com.gymwork"
const APP_STORE_URL = "https://apps.apple.com/app/com.gymwork"

export const useAppUpdate = () => {
  const { skippedVersion, setSkippedVersion } = useSetting()
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [newReleases, setNewReleases] = useState<AirtableRelease[]>([])
  const [latestVersion, setLatestVersion] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkViaAirtable = async () => {
      try {
        const releases = await airtableApi.getReleases()
        if (releases.length === 0) return false

        const currentVersion = Constants.expoConfig?.version
        if (!currentVersion || !valid(currentVersion)) {
          console.warn("Could not determine current app version")
          return false
        }

        const sortedReleases = releases
          .filter((r) => valid(r.version))
          .sort((a, b) => compare(b.version, a.version))

        if (sortedReleases.length === 0) return false

        const newerReleases = sortedReleases.filter((r) => compare(r.version, currentVersion) > 0)

        if (newerReleases.length === 0) return false

        const latest = newerReleases[0]

        if (latest.version === skippedVersion) {
          return false
        }

        setUpdateAvailable(true)
        setLatestVersion(latest.version)
        setNewReleases(newerReleases)
        return true
      } catch (e) {
        console.error("Failed to check version via Airtable:", e)
        return false
      }
    }

    const checkFn = async () => {
      if (__DEV__) {
        console.log("Skipping update check in DEV mode")
        setLoading(false)
        return
      }

      await checkViaAirtable()
      setLoading(false)
    }

    checkFn()
  }, [skippedVersion])

  const dismissUpdate = () => {
    if (latestVersion) {
      setSkippedVersion(latestVersion)
      setUpdateAvailable(false)
    }
  }

  const performUpdate = useCallback(async () => {
    try {
      if (Platform.OS === "android") {
        // Try to open Play Store app first, fallback to web URL
        const canOpen = await Linking.canOpenURL(PLAY_STORE_URL)
        await Linking.openURL(canOpen ? PLAY_STORE_URL : PLAY_STORE_WEB_URL)
      } else {
        await Linking.openURL(APP_STORE_URL)
      }
    } catch (e) {
      console.error("Failed to open store", e)
    }
  }, [])

  return {
    loading,
    updateAvailable,
    newReleases,
    latestVersion,
    dismissUpdate,
    performUpdate,
  }
}
