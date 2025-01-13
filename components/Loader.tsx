import LottieView from 'lottie-react-native'
import React from 'react'
import { View } from 'react-native'

function Loader() {
  return (
    <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#1A1A24",
    }}
  >
    <LottieView
      source={require("../assets/images/loader.json")}
      autoPlay
      style={{ width: 250, height: 250 }}
      loop
    />
  </View>
  )
}

export default Loader   