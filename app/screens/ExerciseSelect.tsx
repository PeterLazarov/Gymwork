import { observer } from "mobx-react-lite";
import React from "react";
import { View } from "react-native";
import { Appbar } from "react-native-paper";

import AllExerciseSelect from "../components/Exercise/AllExerciseSelect";
import FavoriteExerciseSelect from "../components/Exercise/FavoriteExerciseSelect";
import { useStores } from "../db/helpers/useStores";
import { Exercise } from "../db/models";
import { Icon } from "../../designSystem";
import SwipeTabs from "../../designSystem/SwipeTabs";
import colors from "../../designSystem/colors";
import texts from "../texts";
import { AppStackScreenProps } from "app/navigators";

interface ExerciseSelectProps extends AppStackScreenProps<"ExerciseSelect"> {}

const ExerciseSelectPage: React.FC<ExerciseSelectProps> = ({ navigation }) => {
  const { stateStore } = useStores();

  function handleSelectExercise(exercise: Exercise) {
    stateStore.setOpenedExercise(exercise);
    navigation.navigate("ExerciseSelect", {
      screen: "ExerciseSelect",
      params: {},
    });
  }

  function onBackPress() {
    navigation.navigate("Workout", { screen: "Workout", params: {} });
  }

  function onAddExercisePress() {
    navigation.navigate("ExerciseCreate", {
      screen: "ExerciseCreate",
      params: {},
    });
  }

  const tabsConfig = [
    {
      label: "Most used",
      name: "tabFavorite",
      component: FavoriteExerciseSelect,
      props: { onSelect: handleSelectExercise },
    },
    {
      label: "All exercises",
      name: "tabAll",
      component: AllExerciseSelect,
      props: { onSelect: handleSelectExercise },
    },
  ];
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title={texts.selectExercise} />
        <Appbar.Action
          icon={() => <Icon icon="add" size="large" />}
          onPress={onAddExercisePress}
          animated={false}
        />
      </Appbar.Header>

      <SwipeTabs tabsConfig={tabsConfig} />
    </View>
  );
};
export default observer(ExerciseSelectPage);
