import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useSyncQueriesExternal } from "react-query-external-sync"
// Import Platform for React Native or use other platform detection for web/desktop
import { Platform } from "react-native"
import * as ExpoDevice from "expo-device"
import { storage } from "@/utils/storage" // Your MMKV instance
import React from "react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

// Configures Devtools for Tanstack Query
// https://github.com/LovesWorking/rn-better-dev-tools
// https://tanstack.com/query/latest/docs/framework/react/react-native

// NOTE: all steps related to networks are skipped
// https://tanstack.com/query/latest/docs/framework/react/react-native

// Create your query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable retries since all data is local (no network failures to retry)
      staleTime: Infinity,

      // structuralSharing TODO

      // Ensure queries always run, even offline (suitable for local SQLite-only apps)
      networkMode: "always",
    },
    mutations: {
      // Ensure mutations always proceed (offline-first mindset)
      networkMode: "always",
    },
  },
})

export function TanstackQueryProvider({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <TackstackQueryDevtools>{children}</TackstackQueryDevtools>
    </QueryClientProvider>
  )
}

function TackstackQueryDevtools({ children }: React.PropsWithChildren) {
  // Set up the sync hook - automatically disabled in production!
  useSyncQueriesExternal({
    queryClient,
    socketURL: "http://localhost:42831", // Default port for React Native DevTools
    deviceName: Platform?.OS || "web", // Platform detection
    platform: Platform?.OS || "web", // Use appropriate platform identifier
    deviceId: Platform?.OS || "web", // Use a PERSISTENT identifier (see note below)
    isDevice: ExpoDevice.isDevice, // Automatically detects real devices vs emulators
    extraDeviceInfo: {
      // Optional additional info about your device
      appVersion: "1.0.0",
      // Add any relevant platform info
    },
    enableLogs: false,
    envVariables: {
      NODE_ENV: process.env.NODE_ENV,
      // Add any private environment variables you want to monitor
      // Public environment variables are automatically loaded
    },
    // Storage monitoring with CRUD operations
    mmkvStorage: storage, // MMKV storage for ['#storage', 'mmkv', 'key'] queries + monitoring
    // asyncStorage: AsyncStorage, // AsyncStorage for ['#storage', 'async', 'key'] queries + monitoring
    // secureStorage: SecureStore, // SecureStore for ['#storage', 'secure', 'key'] queries + monitoring
    secureStorageKeys: ["userToken", "refreshToken", "biometricKey", "deviceId"], // SecureStore keys to monitor
  })

  // Your app content
  return (
    <>
      {/* https://tanstack.com/query/latest/docs/framework/react/devtools */}
      {__DEV__ && Platform.OS === "web" && <ReactQueryDevtools />}
      {children}
    </>
  )
}
