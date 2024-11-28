import { getQuiz } from "@/Services/quizService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
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
    <View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 50,
          flexDirection: "column",
        }}
      >
        <Image
          style={{ height: 100, width: 100 }}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTktshkpiqASiFa-NgEv90YBzkDXmyShroAHg&s",
          }}
        />
        <Text
          variant="headlineSmall"
          style={{ color: "#378fe9", fontWeight: 800 }}
        >
          How to play ?
        </Text>
      </View>
      <View style={{ padding: 20 }}>
        <Text variant="titleSmall">
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
          style={{ backgroundColor: "red" }}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          style={{ backgroundColor: "#378fe9" }}
          onPress={() =>
            router.push({
              pathname: "/quiz/[id]" as any,
              params: { id: id },
            })
          }
        >
          Play
        </Button>
      </View>
    </View>
  );
}

export default Instruction;
