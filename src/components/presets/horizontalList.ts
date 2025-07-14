import { Dimensions } from "react-native"

import { spacing } from "@/theme/spacing"

import { ListViewProps } from "../Ignite/ListView"

export function getHorizontalListConfig<T>(
  cols = 1,
  itemHeight: number,
  listWidth = Dimensions.get("window").width,
) {
  return {
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    decelerationRate: "fast",
    snapToAlignment: "start",
    contentContainerStyle: { paddingHorizontal: spacing.md },
    estimatedListSize: {
      height: itemHeight,
      width: listWidth / cols - spacing.md * 2,
    },
  } satisfies Partial<ListViewProps<T>>
}
