import React from "react"

import { fontSize, Text, useColors } from "@/designSystem"
import { translate } from "@/utils"

type Props = {
  total: string | number
  unit: string
  done?: string | number
  left?: string | number
  met: boolean
  center?: boolean
  testID?: string
}

function clean(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\s+,/g, ",").trim()
}

export const TargetProgressText: React.FC<Props> = ({
  total,
  unit,
  done,
  left,
  met,
  center,
  testID,
}) => {
  const colors = useColors()

  const text = met
    ? translate("targetDone", { total, unit, done })
    : translate("targetLeft", { total, unit, left })

  return (
    <Text
      testID={testID}
      style={{
        textAlign: center ? "center" : "left",
        fontSize: fontSize.sm,
        color: colors.onSurfaceVariant,
      }}
    >
      {clean(text)}
    </Text>
  )
}
