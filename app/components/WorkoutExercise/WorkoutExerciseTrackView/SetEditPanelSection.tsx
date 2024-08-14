import React, { ReactNode } from "react";
import { View } from "react-native";

import { Divider } from "../../../../designSystem";
import { BodySmallLabel } from "../../../../designSystem/Label";

type Props = {
  text: string;
  children: ReactNode;
};

const SetEditPanelSection: React.FC<Props> = ({ text, children }) => {
  return (
    <View style={{ gap: 16 }}>
      <View>
        <BodySmallLabel style={{ textTransform: "uppercase" }}>
          {text}
        </BodySmallLabel>
        <Divider />
      </View>
      {children}
    </View>
  );
};

export default SetEditPanelSection;
