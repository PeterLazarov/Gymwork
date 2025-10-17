import { useCallback, useState } from "react"
import { deleteValue, getValue, setValue } from "./db"

/**
 * Custom hook to replace useMMKVString from react-native-mmkv
 * Provides a stateful string value that persists to SQLite storage
 *
 * @param key The storage key
 * @param initialValue Optional initial value
 * @returns A tuple of [value, setValue] similar to useState
 */
export function useStorageString(
  key: string,
  initialValue?: string,
): [string | undefined, (value: string | undefined) => void] {
  const [value, setValueState] = useState<string | undefined>(() => {
    const storedValue = getValue(key)
    return storedValue ?? initialValue
  })

  const setValueWrapper = useCallback(
    (newValue: string | undefined) => {
      if (newValue === undefined) {
        // If setting to undefined, delete the key
        try {
          deleteValue(key)
          setValueState(undefined)
        } catch (error) {
          console.error("Failed to delete value:", error)
        }
      } else {
        try {
          setValue(key, newValue)
          setValueState(newValue)
        } catch (error) {
          console.error("Failed to set value:", error)
        }
      }
    },
    [key],
  )

  return [value, setValueWrapper]
}

/**
 * Custom hook for number values
 */
export function useStorageNumber(
  key: string,
  initialValue?: number,
): [number | undefined, (value: number | undefined) => void] {
  const [stringValue, setStringValue] = useStorageString(
    key,
    initialValue?.toString(),
  )

  const numberValue = stringValue !== undefined ? Number(stringValue) : undefined

  const setNumberValue = useCallback(
    (value: number | undefined) => {
      setStringValue(value !== undefined ? value.toString() : undefined)
    },
    [setStringValue],
  )

  return [numberValue, setNumberValue]
}

/**
 * Custom hook for boolean values
 */
export function useStorageBoolean(
  key: string,
  initialValue?: boolean,
): [boolean | undefined, (value: boolean | undefined) => void] {
  const [stringValue, setStringValue] = useStorageString(
    key,
    initialValue?.toString(),
  )

  const booleanValue = stringValue !== undefined ? stringValue === "true" : undefined

  const setBooleanValue = useCallback(
    (value: boolean | undefined) => {
      setStringValue(value !== undefined ? value.toString() : undefined)
    },
    [setStringValue],
  )

  return [booleanValue, setBooleanValue]
}

