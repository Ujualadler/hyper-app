import { useAuth } from "@/Context/AuthContext";
import { getPreviousQuiz } from "@/Services/quizService";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import LottieView from "lottie-react-native";

function Header() {
  const router = useRouter();
  const { logout } = useAuth();
  const [statitics, setStatitics] = React.useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        const response = await getPreviousQuiz();
        if (response) {
          setStatitics(response.data.rewardData);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* <View style={styles.quizPlayed}>
        <TouchableOpacity onPress={() => router.push("/previousQuiz")}>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              position: "relative",
            }}
          >
            <LottieView
              source={require("../assets/images/bulb.json")}
              autoPlay
              style={{ width: 40, height: 40, marginLeft: 12 }}
              loop
            />

            <Text
              style={{
                fontWeight: 700,
                color: "#027bad",
                fontSize: 20,
                left: 7,
                top: 9,
                position: "absolute",
              }}
            >
              {statitics?.totalQuizzes || 0}
            </Text>
          </View>
        </TouchableOpacity>
        <Text variant="bodySmall" style={{ ...styles.text }}>
          Quizzes
        </Text>
      </View> */}
      <Text variant="headlineSmall" style={styles.text}>
        Hyper
      </Text>
      {/* <Image source={require('../assets/images/logo-light.png')} style={{height:70,width:70}}/> */}

      <View style={styles.rightContainer}>
        {/* <TouchableOpacity onPress={() => router.push("/overallRank")}>
          <View style={{ display: "flex", flexDirection: "column" }}>
            <LottieView
              source={require("../assets/images/trophy.json")}
              autoPlay
              style={{ width: 40, height: 40 }}
              loop
            />
            <Text variant="bodySmall" style={styles.text}>
              {statitics?.totalpointsCollected
                ? statitics.totalpointsCollected.toFixed()
                : 0}
            </Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => router.push("/reward")}>
          <View style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <LottieView
              source={require("../assets/images/wallet.json")}
              autoPlay
              style={{ width: 40, height: 40 }}
              loop
            />
           
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    zIndex: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    alignItems: "center",
    height: 70,
    backgroundColor: "rgba(26, 26, 36, 0)", // Use rgba for background opacity
  },
  iconButton: {
    height: 30,
    width: 30,
    // Optional styles for the icon button
    marginBottom: 0, // Space between icon and text
  },
  quizPlayed: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700", // Make sure to pass fontWeight as a string
  },
  rightContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
