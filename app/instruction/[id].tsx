import ParallaxScrollView from "@/components/ParallaxScrollView";
import { getQuiz } from "@/Services/quizService";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

function Instruction() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await getQuiz(id as any, "light");
        if (response.data) {
          setQuizData(response.data);
        }
        setQuizData(response);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };
    fetchQuiz();
  }, [id]);

  console.log(quizData);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      marginTopProp={0}
      background="#fff"
      headerImage={
        <Image
              source={require('../../assets/images/instruction.jpg')}
          style={styles.topImage}
        />
      }
    >
      <View style={styles.container}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
            backgroundColor: "",
            flexDirection: "column",
          }}
        >
          {/* <Image
          style={{ height: 100, width: 100 }}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTktshkpiqASiFa-NgEv90YBzkDXmyShroAHg&s",
          }}
        /> */}
          <Text
            variant="headlineSmall"
            style={{ color: "#6846f3", fontWeight: 800 }}
          >
            How to play ?
          </Text>
        </View>
        <View style={{ padding: 20 }}>
          <Text variant="titleSmall" style={{ color: "black" }}>
            Welcome to the {quizData?.name}! quiz Please read the following
            instructions carefully before starting the quiz:
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            gap: 10,
            flexDirection: "row",
          }}
        >
          <Button
            onPress={() => router.push("/" as any)}
            mode="contained"
            style={{ backgroundColor: "red", borderRadius: 10 }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            theme={{ roundness: 10 }}
            icon="gamepad"
            style={{ backgroundColor: "#6846f3", borderRadius: 10 }}
            textColor="white"
            onPress={() =>
              router.push({
                pathname: "/quiz/[id]" as any,
                params: { id: id },
              })
            }
          >
            Let's Play
          </Button>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

export default Instruction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "SairaStencilOne",
    padding: 16,
    backgroundColor: "#fff", // Background color for the page
  },
  topImage: {
    height: 200,
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});
