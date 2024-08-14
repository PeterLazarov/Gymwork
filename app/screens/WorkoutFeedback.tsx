import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import React from "react";
import { ScrollView, View } from "react-native";
import { Appbar, TextInput, Button } from "react-native-paper";

import FeedbackPicker from "../components/FeedbackPicker";
import { useStores } from "../db/helpers/useStores";
import { BodyLargeLabel } from "../../designSystem/Label";
import colors from "../../designSystem/colors";

const WorkoutFeedbackPage: React.FC = () => {
  const { stateStore } = useStores();
  const router = useRouter();

  function onBackPress() {
    router.push("/");
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title="Workout comments" />
      </Appbar.Header>

      <View style={{ padding: 8, gap: 16, flex: 1 }}>
        <BodyLargeLabel style={{ textAlign: "center" }}>
          How was the workout?
        </BodyLargeLabel>
        <FeedbackPicker
          onChange={(feeling) =>
            stateStore.openedWorkout!.setProp("feeling", feeling)
          }
        />
        <ScrollView>
          <TextInput
            value={stateStore.openedWorkout?.notes}
            onChangeText={(text) =>
              stateStore.openedWorkout!.setProp("notes", text)
            }
            multiline
            placeholder="Enter comments..."
          />
        </ScrollView>
        <Button mode="contained" onPress={onBackPress}>
          Continue
        </Button>
      </View>
    </View>
  );
};
export default observer(WorkoutFeedbackPage);
