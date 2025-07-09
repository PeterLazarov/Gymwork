import { useEffect, useMemo, useRef, useState } from "react"
import { useWindowDimensions, View } from "react-native"
import { Button, ContextMenu, Picker } from "@expo/ui/swift-ui"
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { AppleIcon } from "react-native-bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"

import { ExerciseSelectContents } from "./ExerciseSelectContents"
import { ExerciseSelectContext, SortDirection, SortType, sortTypes } from "./ExerciseSelectContext"
import { Text } from "../Ignite/Text"

// If the search was left open when the sheet was closed, the state is somehow preserved
let initSearchOpen = false
const sortBtnSize = 50

export interface ExerciseSelectProps {
  isVisible: boolean
  setIsVisible(b: boolean): void
  onSelect(id: string): void
}

export function ExerciseSelect(props: ExerciseSelectProps) {
  const Stack = createNativeStackNavigator()

  const { theme } = useAppTheme()

  const { top } = useSafeAreaInsets()
  const { height } = useWindowDimensions()

  const actionSheet = useRef<TrueSheet>(null)

  const { drizzleDB } = useDB()
  const { data: areas } = useLiveQuery(
    drizzleDB.query.muscle_areas.findMany({
      orderBy(fields, operators) {
        return fields.name
      },
    }),
  )
  const { data: equipment } = useLiveQuery(
    drizzleDB.query.equipment.findMany({
      orderBy(fields, operators) {
        return fields.name
      },
    }),
  )

  useEffect(() => {
    if (props.isVisible === true) {
      actionSheet.current?.present()
    } else {
      actionSheet.current?.dismiss()
    }
  }, [props.isVisible])

  const [searchOpen, setSearchOpen] = useState(initSearchOpen)
  const [searchString, setSearchString] = useState<string | null>(null)

  useEffect(() => {
    initSearchOpen = searchOpen
  }, [searchOpen])

  const [sortType, setSortType] = useState<SortType>("Name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("ASC")

  const [filterAreaIndex, setFilterAreaIndex] = useState<number | null>(null)
  const [filterEquipmentIndex, setFilterEquipmentIndex] = useState<number | null>(null)

  const filterArea = useMemo(
    () => (filterAreaIndex ? areas[filterAreaIndex] : null),
    [filterAreaIndex],
  )
  const filterEquipment = useMemo(
    () => (filterEquipmentIndex ? areas[filterEquipmentIndex] : null),
    [filterEquipmentIndex],
  )

  const areaOptions = useMemo(() => ["Any"].concat(...areas.map(({ name }) => name)), [areas])
  const equipmentOptions = useMemo(
    () => ["Any"].concat(...equipment.map(({ name }) => name)),
    [equipment],
  )

  return (
    <TrueSheet
      ref={actionSheet}
      sizes={["large"]}
      onDismiss={() => {
        props.setIsVisible(false)
      }}
    >
      <ExerciseSelectContext.Provider
        value={{
          searchOpen,
          searchString,
          sortDirection,
          sortType,
          area: filterArea?.id ?? null,
          equipment: filterEquipment?.id ?? null,
        }}
      >
        <View
          style={{
            height: height - top,
            // backgroundColor: "gray"
          }}
        >
          <Stack.Navigator>
            <Stack.Screen
              name="exerciseSelect"
              component={ExerciseSelectContents}
              options={{
                // headerLargeTitle: true,
                // title: "3 selected",
                headerTitle(props) {
                  return <Text></Text>
                },

                headerLeft(props) {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: theme.spacing.md,
                      }}
                    >
                      <ContextMenu
                        style={{
                          height: sortBtnSize,
                          width: 64,
                          marginLeft: -12,
                        }}
                      >
                        <ContextMenu.Items>
                          <Picker
                            options={areaOptions}
                            selectedIndex={filterAreaIndex === null ? null : filterAreaIndex + 1}
                            onOptionSelected={({ nativeEvent: { index } }) => {
                              // Accounts for deselection (null option)
                              console.log("area ", index)
                              if (index === 0) {
                                setFilterAreaIndex(null)
                                return
                              }
                              setFilterAreaIndex(index - 1)
                            }}
                            variant="inline"
                          />
                        </ContextMenu.Items>
                        <ContextMenu.Trigger>
                          <Button
                            style={
                              {
                                // backgroundColor: "red",
                              }
                            }
                            variant="accessoryBarAction"
                            // TODO replace with muscle icon?
                          >
                            Area
                          </Button>
                        </ContextMenu.Trigger>
                      </ContextMenu>

                      <ContextMenu
                        style={{
                          height: sortBtnSize,
                          width: 96,
                        }}
                      >
                        <ContextMenu.Items>
                          <Picker
                            options={equipmentOptions}
                            selectedIndex={
                              filterEquipmentIndex === null ? null : filterEquipmentIndex + 1
                            }
                            onOptionSelected={({ nativeEvent: { index } }) => {
                              if (index === 0) {
                                setFilterEquipmentIndex(null)
                                return
                              }
                              setFilterEquipmentIndex(index - 1)
                            }}
                            variant="inline"
                          />
                        </ContextMenu.Items>
                        <ContextMenu.Trigger>
                          <Button
                            variant="accessoryBarAction"
                            // TODO replace with muscle icon?
                          >
                            Equipment
                          </Button>
                        </ContextMenu.Trigger>
                      </ContextMenu>
                    </View>
                  )
                },
                headerRight() {
                  return (
                    <>
                      <ContextMenu
                        style={{
                          width: sortBtnSize,
                          height: sortBtnSize,
                          marginRight: -theme.spacing.md,
                        }}
                      >
                        <ContextMenu.Items>
                          {sortTypes.map((type) => (
                            <Button
                              key={type}
                              systemImage={
                                sortType === type
                                  ? sortDirection === "ASC"
                                    ? "chevron.down"
                                    : "chevron.up"
                                  : undefined
                              }
                              onPress={() => {
                                setSortType(type)
                                setSortDirection(
                                  sortType === type
                                    ? sortDirection === "ASC"
                                      ? "DESC"
                                      : "ASC"
                                    : "ASC",
                                )
                              }}
                            >
                              {type}
                            </Button>
                          ))}
                        </ContextMenu.Items>
                        <ContextMenu.Trigger>
                          <Button
                            systemImage={"arrow.up.arrow.down" as AppleIcon["sfSymbol"]}
                            variant="accessoryBarAction"
                            style={{ width: sortBtnSize, height: sortBtnSize }}
                          >
                            {""}
                          </Button>
                        </ContextMenu.Trigger>
                      </ContextMenu>

                      {/* more options */}
                      <ContextMenu
                        style={{
                          width: sortBtnSize,
                          height: sortBtnSize,
                          marginRight: -theme.spacing.md,
                        }}
                      >
                        <ContextMenu.Items>
                          <Button
                            systemImage={"plus" as AppleIcon["sfSymbol"]}
                            onPress={() => console.log("PRESSED CREATE EXERCISE")}
                          >
                            Create Exercise
                          </Button>
                        </ContextMenu.Items>
                        <ContextMenu.Trigger>
                          <Button
                            systemImage={"ellipsis.circle" as AppleIcon["sfSymbol"]}
                            variant="accessoryBarAction"
                            style={{ width: sortBtnSize, height: sortBtnSize }}
                          >
                            {""}
                          </Button>
                        </ContextMenu.Trigger>
                      </ContextMenu>
                    </>
                  )
                },

                headerSearchBarOptions: {
                  onFocus() {
                    setSearchOpen(true)
                  },

                  onCancelButtonPress(e) {
                    setSearchOpen(false)
                  },

                  placement: "stacked",
                  onChangeText(e) {
                    // Use context setter
                    setSearchString(e.nativeEvent.text.length ? e.nativeEvent.text : null)
                  },
                },
              }}
            />
          </Stack.Navigator>
        </View>
      </ExerciseSelectContext.Provider>
    </TrueSheet>
  )
}
