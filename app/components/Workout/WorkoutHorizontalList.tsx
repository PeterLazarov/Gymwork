import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useRef } from "react";
import { FlatList, ListRenderItemInfo, Text } from "react-native";

import WorkoutExerciseList from "./WorkoutExerciseList";
import { useStores } from "../../db/helpers/useStores";
import HorizontalScreenList from "../../../designSystem/HorizontalScreenList";
import { getDateRange } from "../../utils/date";

// TODO this breaks BADLY if the date goes outside of this range
const datePaddingCount = 365;

function WorkoutHorizontalList() {
  const { stateStore, workoutStore } = useStores();
  const workoutList = useRef<FlatList<string>>(null);

  const dates = useMemo(() => {
    const firstWorkout =
      workoutStore.workouts[workoutStore.workouts.length - 1];
    const lastWorkout = workoutStore.workouts[0];

    const from = (
      firstWorkout ? DateTime.fromISO(firstWorkout.date) : DateTime.now()
    )
      .minus({ day: datePaddingCount })
      .toISODate()!;

    const to = (
      lastWorkout ? DateTime.fromISO(lastWorkout.date) : DateTime.now()
    )
      .plus({ day: datePaddingCount })
      .toISODate()!;

    return getDateRange(from, to);
  }, []);

  function onScreenChange(index: number) {
    stateStore.setOpenedDate(dates[index]);
  }

  // TODO render workout scre
  const renderItem = ({ item, index }: ListRenderItemInfo<string>) => {
    const date = dates[index];
    const workout = workoutStore.getWorkoutForDate(date);
    // console.log(date, workout)
    return workout ? (
      <WorkoutExerciseList workout={workout} />
    ) : (
      // TODO prettier fallback
      <Text>No workout found for date: {date}</Text>
    );
  };
  useEffect(() => {
    const index = dates.indexOf(stateStore.openedDate);

    if (index < 0 || index >= dates.length) {
      // should not happen
      return;
    }

    // TODO bug. does not react to all scrolls. Throttle or Debounce?
    // Scrolls list from external sources
    workoutList.current?.scrollToIndex({ index, animated: false });
  }, [stateStore.openedDate]);

  return (
    <HorizontalScreenList
      ref={workoutList}
      data={dates}
      renderItem={renderItem}
      onScreenChange={onScreenChange}
      initialScrollIndex={dates.indexOf(stateStore.openedDate)}
    />
  );
}

export default observer(WorkoutHorizontalList);
