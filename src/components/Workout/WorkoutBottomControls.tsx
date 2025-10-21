import React from "react"
import { TouchableOpacity, View } from "react-native"

import { formatDate } from "@/utils"
import { Icon, Text, useColors, spacing } from "@/designSystem"
import { AddStepMenu } from "./AddStepMenu"
import { useOpenedDate } from "@/context/OpenedDateContext"

export const WorkoutBottomControls = () => {
  const colors = useColors()
  const { openedDateObject, incrementDate, decrementDate } = useOpenedDate()

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: spacing.xs,
      }}
    >
      <TouchableOpacity
        onPress={decrementDate}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Icon
            icon="chevron-back"
            color={colors.secondary}
          />
          <Text style={{ color: colors.secondary }}>
            {formatDate(openedDateObject.minus({ day: 1 }), "short")}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: "center" }}>
        <AddStepMenu />
      </View>
      <TouchableOpacity
        onPress={incrementDate}
        style={{
          alignItems: "flex-end",
          flex: 1,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={{ color: colors.secondary }}>
            {formatDate(openedDateObject.plus({ day: 1 }), "short")}
          </Text>
          <Icon
            icon="chevron-forward"
            color={colors.secondary}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}
