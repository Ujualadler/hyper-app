import LottieView from "lottie-react-native";
import React from "react";
import { Image, View } from "react-native";
import { Text } from "react-native-paper";

function NoData() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="bodySmall" style={{fontWeight:600,color:'white'}}>No data found</Text>
    </View>
  );
}

export default NoData;
