import { ColorValue, StyleProp, ViewStyle } from "react-native";

const colorGen = (function* getColor() {
  const colors: ColorValue[] = ["red", "green", "blue"];
  for (let i = 0; true; i++) {
    yield colors[i];
    if (i === colors.length - 1) {
      i = -1;
    }
  }
})();

/**
 * Can be spread into style objects. Provides clear border of element
 * @returns Border styles with rotating colors
 */
export const getDebugStyles = (): StyleProp<ViewStyle> & object => ({
  borderColor: colorGen.next().value!,
  borderWidth: 8,
  borderStyle: "dotted",
});
