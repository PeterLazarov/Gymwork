import { observer } from "mobx-react-lite";
import React from "react";

import ExerciseListItem from "./ExerciseListItem";
import { Exercise } from "../../db/models";

type Props = {
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
};
const ExerciseList: React.FC<Props> = ({ exercises, onSelect }) => {
  return (
    <>
      {exercises.map((exercise) => (
        <ExerciseListItem
          key={exercise.guid}
          exercise={exercise}
          onSelect={onSelect}
        />
      ))}
    </>
  );
};

export default observer(ExerciseList);
