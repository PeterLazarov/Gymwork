import React, { useState } from "react"
import { Menu } from "react-native-paper"

// import { useStores } from "app/db/helpers/useStores"
import { formatDateIso, translate, useShareWorkout } from "@/utils"
import { Header, Icon, IconButton, useColors } from "@/designSystem"
// import HomeMenuItems from "../HomeMenuItems"
import { MiniTimer } from "../MiniTimer"
import { DayControl } from "./DayControls"
import { useOpenedDate } from "@/context/OpenedDateContext"
// import WorkoutTimerModal from "../Timer/WorkoutTimerModal"

export const WorkoutHeader: React.FC = () => {
  const colors = useColors()

  const { showCommentsCard } = settingsStore

  const [menuOpen, setMenuOpen] = useState(false)
  const { openedDateLabel } = useOpenedDate()

  function openCalendar() {
    // navigate("Calendar")
  }

  function saveTemplate() {
    setMenuOpen(false)
    // navigate("SaveTemplate")
  }

  function toggleCommentsCard() {
    setMenuOpen(false)
    // settingsStore.setProp("showCommentsCard", !showCommentsCard)
  }

  const deleteWorkout = () => {
    setMenuOpen(false)
    // workoutStore.removeWorkout(openedWorkout!)
  }

  const [showWorkoutTimerModal, setShowWorkoutTimerModal] = useState(false)
  const shareWorkout = useShareWorkout()
  return (
    <Header>
      <Header.Title title={openedDateLabel} />

      {/* {settingsStore.showWorkoutTimer && (
        <>
          <MiniTimer
            n={Math.floor(timerStore.workoutTimer.timeElapsed.as("minutes"))}
            onPress={() => setShowWorkoutTimerModal(true)}
          />

          <WorkoutTimerModal
            open={showWorkoutTimerModal}
            onClose={() => setShowWorkoutTimerModal(false)}
            timer={timerStore.workoutTimer}
          />
        </>
      )} */}

      <IconButton
        onPress={openCalendar}
        underlay="darker"
      >
        <Icon
          icon="calendar-sharp"
          color={colors.onPrimary}
        />
      </IconButton>

      <Menu
        visible={menuOpen}
        onDismiss={() => setMenuOpen(false)}
        anchorPosition="bottom"
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
            title={translate(showCommentsCard ? "hideCommentsCard" : "showCommentsCard")}
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
        {/* <HomeMenuItems onClose={() => setMenuOpen(false)} /> */}
      </Menu>
    </Header>
  )
}
