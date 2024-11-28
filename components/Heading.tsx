import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

type headingProps = {
   title:string
}


  

function Heading({title}:headingProps) {
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        justifyContent: "center",
        paddingHorizontal: 10,
        marginVertical:20   
      }}
    >
      <View style={{ width: "40%", height: 2, backgroundColor: "black" }} />
      <Text style={{fontWeight:700}} variant="bodyMedium">{title}</Text>
      <View style={{ width: "40%", height: 2, backgroundColor: "black" }} />
    </View>
  );
}

export default Heading;
