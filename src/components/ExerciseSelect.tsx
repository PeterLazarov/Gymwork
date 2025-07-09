import { useEffect, useRef, useState, createContext, useContext } from "react"
import { Image, PlatformColor, useWindowDimensions, View, Animated } from "react-native"
import { Button } from "@expo/ui/swift-ui"
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { AppleIcon } from "react-native-bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { exercises } from "@/db/sqlite/schema"
import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"
import { exerciseImages } from "@/utils/exerciseImages"
import { IosPlatformColor } from "@/utils/iosColors"

import { ListItem } from "./Ignite/ListItem"
import { ListView } from "./Ignite/ListView"
import { Screen } from "./Ignite/Screen"
import { Text } from "./Ignite/Text"

export interface ExerciseSelectProps {
  isVisible: boolean
  setIsVisible(b: boolean): void
  onSelect(id: string): void
}

// Add context for searchOpen
interface ExerciseSelectContextType {
  searchOpen: boolean
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const ExerciseSelectContext = createContext<ExerciseSelectContextType | undefined>(undefined)

function useExerciseSelectContext() {
  const ctx = useContext(ExerciseSelectContext)
  if (!ctx)
    throw new Error("useExerciseSelectContext must be used within ExerciseSelectContext.Provider")
  return ctx
}

function SheetContents() {
  const { theme } = useAppTheme()
  const { bottom } = useSafeAreaInsets()
  const { drizzleDB } = useDB()
  const { data } = useLiveQuery(
    drizzleDB.query.exercises.findMany({
      columns: {
        id: true,
        name: true,
        images: true,
      },
      with: {
        exerciseMuscleAreas: {
          columns: {},
          with: {
            muscleArea: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    }),
    [exercises],
  )

  // Access searchOpen from context
  const { searchOpen } = useExerciseSelectContext()

  // Animated margin
  const animatedMargin = useRef(new Animated.Value(48)).current

  useEffect(() => {
    Animated.timing(animatedMargin, {
      toValue: searchOpen ? 0 : 48,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [searchOpen])

  return (
    <Screen safeAreaEdges={["top"]}>
      <Animated.View
        style={{
          marginTop: animatedMargin,
          backgroundColor: PlatformColor(IosPlatformColor.systemBackground),
          height: "100%",
        }}
      >
        {/* Exercise list */}
        <View
          style={{
            flexGrow: 1,
          }}
        >
          <ListView
            contentInset={{
              bottom: (searchOpen ? 0 : 48) + bottom + theme.spacing.xxl,
            }}
            scrollIndicatorInsets={{
              bottom: (searchOpen ? 0 : 48) + bottom + theme.spacing.xxl,
            }}
            renderItem={({ item }) => (
              <ListItem
                style={{
                  flexGrow: 1,
                  height: 64,
                  overflow: "hidden",
                  gap: theme.spacing.sm,
                }}
                containerStyle={{
                  position: "relative",
                }}
                onPress={(e) => {
                  // TODO
                  console.log(e)
                }}
                LeftComponent={
                  <Image
                    width={64}
                    height={64}
                    style={{ height: 64, width: 96 }}
                    source={exerciseImages[item.images[0]]}
                  />
                }
              >
                <View
                  style={{
                    flexDirection: "column",
                    position: "absolute",
                  }}
                >
                  <Text
                    preset="formLabel"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text
                    preset="formHelper"
                    numberOfLines={1}
                  >
                    {item.exerciseMuscleAreas.map((e) => e.muscleArea.name).join(" / ")}
                  </Text>
                </View>
              </ListItem>
            )}
            data={data}
          ></ListView>
        </View>
      </Animated.View>
    </Screen>
  )
}

// If the search was left open when the sheet was closed, the state is somehow preserved
let initSearchOpen = false

export function ExerciseSelect(props: ExerciseSelectProps) {
  const Stack = createNativeStackNavigator()

  const { theme } = useAppTheme()

  const { top } = useSafeAreaInsets()
  const { height } = useWindowDimensions()

  const actionSheet = useRef<TrueSheet>(null)

  useEffect(() => {
    if (props.isVisible === true) {
      actionSheet.current?.present()
    } else {
      actionSheet.current?.dismiss()
    }
  }, [props.isVisible])

  const [searchOpen, setSearchOpen] = useState(initSearchOpen)
  useEffect(() => {
    initSearchOpen = searchOpen
  }, [searchOpen])

  return (
    <TrueSheet
      ref={actionSheet}
      sizes={["large"]}
      onDismiss={() => {
        props.setIsVisible(false)
      }}
    >
      <ExerciseSelectContext.Provider value={{ searchOpen, setSearchOpen }}>
        <View
          style={{
            height: height - top,
            // backgroundColor: "gray"
          }}
        >
          <Stack.Navigator>
            <Stack.Screen
              name="exerciseSelect"
              component={SheetContents}
              options={{
                headerTitle(props) {
                  return <Text></Text>
                },

                headerLeft(props) {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: theme.spacing.lg,
                      }}
                    >
                      <Button variant="accessoryBarAction">Area</Button>
                      <Button variant="accessoryBarAction">Equipment</Button>
                    </View>
                  )
                },
                headerRight() {
                  return (
                    <Button
                      systemImage={"arrow.up.arrow.down" as AppleIcon["sfSymbol"]}
                      variant="accessoryBarAction"
                    >
                      {""}
                    </Button>
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
                    // TODO
                    console.log(e.nativeEvent.text)
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
