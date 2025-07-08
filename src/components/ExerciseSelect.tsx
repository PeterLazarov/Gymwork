import { useRef } from "react"
import { Dimensions, View } from "react-native"
import { BottomSheet, Button } from "@expo/ui/swift-ui"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import SearchBar from "react-native-search-bar"

import { exercises } from "@/db/sqlite/schema"
import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"

import { ListItem } from "./Ignite/ListItem"
import { ListView } from "./Ignite/ListView"

export interface ExerciseSelectProps {
  isVisible: boolean
  setIsVisible(b: boolean): void
  onSelect(id: string): void
}

export function ExerciseSelect(props: ExerciseSelectProps) {
  const { top, bottom } = useSafeAreaInsets()
  const { theme } = useAppTheme()

  const searchBarRef = useRef(null)

  const { drizzleDB } = useDB()

  const { data } = useLiveQuery(
    drizzleDB
      .select({
        id: exercises.id,
        name: exercises.name,
      })
      .from(exercises),
    [exercises],
  )

  console.log(data.length)

  return (
    <BottomSheet
      isOpened={props.isVisible}
      onIsOpenedChange={(e) => props.setIsVisible(e)}
    >
      <View
        style={{
          height: Dimensions.get("window").height - top,
        }}
      >
        <SearchBar
          ref={searchBarRef}
          placeholder="Search"
          onChangeText={console.log}
          onSearchButtonPress={console.log}
          onCancelButtonPress={console.log}
        />

        {/* Filter/Sort row */}
        <View
          style={{
            // backgroundColor: "red",
            flexDirection: "row",
            padding: theme.spacing.xs,
            // justifyContent:'space-between'
            gap: theme.spacing.sm,
          }}
        >
          <Button variant="bordered">Muscle Areas</Button>
          <Button variant="bordered">Equipment</Button>

          <View
            style={{
              flexGrow: 1,
              alignItems: "flex-end",
            }}
          >
            <Button variant="bordered">Sort</Button>
          </View>
        </View>

        {/* Exercise list */}
        <View
          style={{
            flexGrow: 1,
          }}
        >
          <ListView
            contentInset={{
              bottom: bottom + theme.spacing.xs, // xs spacing added so that screen rounding coesnt clip indicator
            }}
            scrollIndicatorInsets={{
              bottom: bottom + theme.spacing.xs, // xs spacing added so that screen rounding coesnt clip indicator
            }}
            renderItem={({ item }) => (
              <ListItem
                style={{ paddingHorizontal: theme.spacing.sm }}
                text={item.name}
                onPress={(e) => {
                  console.log(e)
                }}
              ></ListItem>
            )}
            data={data}
          ></ListView>
        </View>
      </View>
    </BottomSheet>
  )
}
