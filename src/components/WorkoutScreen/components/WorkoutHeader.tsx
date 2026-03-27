import React, { useState, useEffect } from "react"
import { View } from 'react-native'
import { Portal, Modal } from 'react-native-paper'

import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { useSetting } from "@/context/SettingContext"
import { Text, Divider, Header, Icon, IconButton, Menu, spacing, useColors, fontSize, DurationInput, Button } from "@/designSystem"
import { translate } from "@/utils"
import { useShareWorkout } from "../utils/useShareWorkout"
import { useRemoveWorkout, useSettings, useUpdateWorkout } from "@/db/hooks"
import { navigate } from "@/navigators/navigationUtilities"
import { MiniTimer } from "./MiniTimer"
import { useTimerContext } from "@/context/TimerContext"
import { DateTime, Duration } from "luxon"

export const WorkoutHeader: React.FC = () => {
  const colors = useColors()

  const { data: settings } = useSettings()
  const { setShowCommentsCard } = useSetting()
  const { mutate: removeWorkout } = useRemoveWorkout()
  const { mutate: updateWorkout } = useUpdateWorkout()
  const timer = useTimerContext()
  const [menuOpen, setMenuOpen] = useState(false)
  const { openedDateLabel, openedWorkout, openedDate } = useOpenedWorkout()
  const isToday = openedDate === DateTime.now().toISODate()

  useEffect(() => {
    if (
      isToday &&
      openedWorkout?.durationMs &&
      !timer.isRunning &&
      (!timer.timeElapsed || timer.timeElapsed.toMillis() === 0)
    ) {
      if (timer.setTimeElapsed) {
        timer.setTimeElapsed(Duration.fromMillis(openedWorkout.durationMs))
      }
    }
  }, [isToday, openedWorkout?.durationMs, timer.isRunning, timer.timeElapsed, timer.setTimeElapsed])

  function openAnalytics() {
    navigate("WorkoutsHistory")
  }

  function saveTemplate() {
    setMenuOpen(false)
    navigate("TemplateSave")
  }

  function toggleCommentsCard() {
    setMenuOpen(false)
    setShowCommentsCard(!settings!.show_comments_card)
  }

  function deleteWorkout() {
    setMenuOpen(false)
    if (openedWorkout) {
      removeWorkout({
        workoutId: openedWorkout.id,
        date: openedWorkout.date
      })
    }
  }

  function goToSettings() {
    setMenuOpen(false)
    navigate("Settings")
  }

  function goToFeedback() {
    setMenuOpen(false)
    navigate("UserFeedback", { referrerPage: "Workout" })
  }

  function stopTimer() {
    if (openedWorkout) {
      updateWorkout({
        workoutId: openedWorkout.id,
        workout: { durationMs: timer.timeElapsed?.toMillis() ?? 0 },
        date: openedWorkout.date
      })
    }
    timer.stop?.()
  }

  const [showWorkoutTimerModal, setShowWorkoutTimerModal] = useState(false)
  const shareWorkout = useShareWorkout()

  return (
    <Header>
      <Header.Title title={openedDateLabel} />

      {settings?.show_workout_timer && openedWorkout && (
        <>
          {isToday && (
            timer.isRunning ? (
              <IconButton onPress={stopTimer}>
                <Icon
                  icon="pause-outline"
                  color={colors.onPrimary}
                />
              </IconButton>
            ) : (
              <IconButton onPress={timer.resume}>
                <Icon
                  icon="play"
                  color={colors.onPrimary}
                />
              </IconButton>
            )
          )}
          <MiniTimer
            n={Math.floor((isToday ? timer.timeElapsed?.as('minutes') : (openedWorkout?.durationMs ?? 0) / 60000) ?? 0)}
            onPress={() => setShowWorkoutTimerModal(true)}
          />

          <WorkoutTimerModal
            open={showWorkoutTimerModal}
            onClose={() => setShowWorkoutTimerModal(false)}
            stopTimer={stopTimer}
            timer={timer}
            isToday={isToday}
          />
        </>
      )}

      <IconButton
        onPress={openAnalytics}
        underlay="darker"
      >
        <Icon
          icon="pie-chart"
          color={colors.onPrimary}
        />
      </IconButton>

      <Menu
        visible={menuOpen}
        onDismiss={() => setMenuOpen(false)}
        position="bottom-right"
        anchor={
          <IconButton
            onPress={() => setMenuOpen(true)}
            underlay="darker"
          >
            <Icon
              icon="ellipsis-vertical"
              color={colors.onPrimary}
            />
          </IconButton>
        }
      >
        {openedWorkout?.hasComments && (
          <Menu.Item
            onPress={toggleCommentsCard}
            title={translate(
              settings!.show_comments_card ? "hideCommentsCard" : "showCommentsCard",
            )}
          />
        )}

        {openedWorkout && (
          <>
            <Menu.Item
              onPress={saveTemplate}
              title={translate("saveAsTemplate")}
            />
            <Menu.Item
              onPress={deleteWorkout}
              title={translate("removeWorkout")}
            />
            <Menu.Item
              onPress={() => {
                shareWorkout(openedWorkout)
              }}
              title={translate("shareWorkout")}
            />
          </>
        )}

        <Menu.Item
          onPress={goToSettings}
          title={translate("settings")}
        />
        <Menu.Item
          onPress={goToFeedback}
          title={translate("giveFeedback")}
        />
      </Menu>
    </Header>
  )
}


export type WorkoutTimerModalProps = {
  open: boolean
  onClose: () => void
  timer: ReturnType<typeof useTimerContext>
  stopTimer: () => void
  isToday?: boolean
}

const WorkoutTimerModal: React.FC<WorkoutTimerModalProps> = ({
  open,
  onClose,
  timer,
  stopTimer,
  isToday = true
}) => {
  const colors = useColors()
  const { openedWorkout } = useOpenedWorkout()
  const { mutate: updateWorkout } = useUpdateWorkout()

  const [localTime, setLocalTime] = useState<Duration | undefined>()

  useEffect(() => {
    if (open) {
      setLocalTime(isToday ? timer.timeElapsed : Duration.fromMillis(openedWorkout?.durationMs ?? 0))
    }
  }, [open, timer.timeElapsed, isToday, openedWorkout?.durationMs])

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: colors.surface,
          marginVertical: spacing.xs,
          marginHorizontal: spacing.md,
        }}
      >
        <Text
          style={{
            fontSize: fontSize.lg,
            textAlign: 'center',
            padding: spacing.md,
          }}
        >
          {'Workout Duration'}
        </Text>
        <Divider
          orientation="horizontal"
          variant="primary"
        />

        <View style={{ flexGrow: 1, padding: spacing.xs }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <DurationInput
              value={isToday ? timer.timeElapsed : localTime}
              format="mm"
              onUpdate={time => {
                if (isToday) {
                  timer.start?.(time)
                } else {
                  setLocalTime(time)
                }
              }}
            />
          </View>

        </View>

        <View style={{ flexDirection: 'row' }}>
          {isToday ? (
            <Button
              variant="tertiary"
              style={{ flex: 1 }}
              onPress={timer.isRunning ? stopTimer : timer.resume}
              text={translate(timer.isRunning ? 'stopTimer' : 'startTimer')}
            />
          ) : (
            <Button
              variant="tertiary"
              style={{ flex: 1 }}
              onPress={() => {
                if (openedWorkout) {
                  updateWorkout({
                    workoutId: openedWorkout.id,
                    workout: { durationMs: localTime?.toMillis() ?? 0 },
                    date: openedWorkout.date
                  })
                }
                onClose()
              }}
              text={translate('save')}
            />
          )}

          <Button
            variant="tertiary"
            style={{ flex: 1 }}
            onPress={onClose}
            text={translate('close')}
          />
        </View>
      </Modal>
    </Portal>
  )
}