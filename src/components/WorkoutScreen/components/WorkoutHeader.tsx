import React, { useState } from "react"
import { Menu } from "react-native-paper"

import { Header, Icon, IconButton, useColors } from "@/designSystem"
import { translate } from "@/utils"
import { useShareWorkout } from "../utils/useShareWorkout"
// import HomeMenuItems from "../HomeMenuItems"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { useSetting } from "@/context/SettingContext"
// import WorkoutTimerModal from "../Timer/WorkoutTimerModal"
import { navigate } from "@/navigators/navigationUtilities"

export const WorkoutHeader: React.FC = () => {
  const colors = useColors()

  const { showCommentsCard, setShowCommentsCard, showWorkoutTimer } = useSetting()

  const [menuOpen, setMenuOpen] = useState(false)
  const { openedDateLabel, openedWorkout } = useOpenedWorkout()

  function openCalendar() {
    navigate("Calendar")
  }

  function saveTemplate() {
    setMenuOpen(false)
    navigate("TemplateSave")
  }

  function toggleCommentsCard() {
    setMenuOpen(false)
    setShowCommentsCard(!showCommentsCard)
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

      {showWorkoutTimer && (
        <>
          {/* <MiniTimer
            n={Math.floor(timerStore.workoutTimer.timeElapsed.as("minutes"))}
            onPress={() => setShowWorkoutTimerModal(true)}
          />

          <WorkoutTimerModal
            open={showWorkoutTimerModal}
            onClose={() => setShowWorkoutTimerModal(false)}
            timer={timerStore.workoutTimer}
          /> */}
        </>
      )}

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
