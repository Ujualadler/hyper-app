import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

type headingProps = {
   title:string,
   color?:string
}


  

function Heading({title,color}:headingProps) {
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        // justifyContent: "center",
        marginLeft:5,
        paddingHorizontal: 10,
        marginTop:20,
        marginBottom:20,   
      }}
    >
      {/* <View style={{ width: "50%", height: 2, backgroundColor:color?color: "transparent" }} /> */}
      <Text style={{fontWeight:700,color:color?color:'white',textAlign:'center'}} variant="bodyLarge">{title}</Text>
      {/* <View style={{ width: "50%", height: 2, backgroundColor:color?color: "transparent"  }} /> */}
    </View>
  );
}

export default Heading;
