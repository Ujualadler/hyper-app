import {
  Image,
  StyleSheet,
  View,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import Heading from "@/components/Heading";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { getPreviousQuiz } from "@/Services/quizService";
import { useAuth } from "@/Context/AuthContext";

const categoryData = [
  {
    title: "Total Quizzes Played",
    image:
      "https://cdn-icons-png.freepik.com/256/12028/12028688.png?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
  },
  {
    title: "Total Questions Answerd",
    image:
      "https://cdn-icons-png.freepik.com/256/8321/8321972.png?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
  },
  {
    title: "Correct Questions Answered",
    image:
      "https://cdn-icons-png.freepik.com/256/13745/13745597.png?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
  },
  {
    title: "Percentage",
    image:
      "https://cdn-icons-png.freepik.com/256/4850/4850724.png?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
  },
  {
    title: "Reward Collected",
    image:
      "https://cdn-icons-png.freepik.com/256/4850/4850724.png?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
  },
  {
    title: "Reward Redeemed",
    image:
      "https://cdn-icons-png.freepik.com/256/4850/4850724.png?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
  },
];

const quizzData = [
  {
    title: "Domino's Quiz",
    image:
      "data:image/png;base64,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",
    reward: 50,
    rank: 1,
  },
  {
    title: "Swiggy Quiz",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTemX8BlwnxjDR-MJl72mYahJhY0PnrbUaETA&s",
    reward: 30,
    rank: 2,
  },
  {
    title: "Nike Quiz",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSssjLV2HMg2sS4GRW5UenCA3_BpYHEbD2OpQ&s",
    reward: 20,
    rank: 3,
  },
  {
    title: "Adidas Quiz",
    image:
      "data:image/png;base64,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",
    reward: 10,
    rank: 4,
  },
];

const renderCategoryItem = ({ item }: any) => (
  <View style={styles.gridItem}>
    <Text style={styles.itemText1} variant="headlineSmall">
      12
    </Text>
    <Text style={styles.itemText} variant="bodySmall">
      {item.title}
    </Text>
  </View>
);

export default function Reward() {
  const router = useRouter();
  const { userName, accessToken, logout } = useAuth();

  const [quizData, setQuizData] = useState<any>([]);
  const [quizId, setId] = useState<string>("");
  const [statitics, setStatitics] = useState<any>("");

  const renderQuizzItem = ({ item }: any) => (
    <TouchableOpacity
      style={gridStyle.pressable}
      onPress={() =>
        router.push({
          pathname: "/leaderboard/[id]" as any,
          params: { id: item.assessment._id },
        })
      }
    >
      <View style={gridStyle.gridItem}>
        <ImageBackground
          source={{
            uri:
              item.category === "live"
                ? "https://img.freepik.com/free-vector/stylish-think-ask-question-mark-concept-template-design_1017-50389.jpg?t=st=1731916140~exp=1731919740~hmac=3005b0bfb66e496f48fc1786a84b5fc6801a59ed75cf102a36d275b2cdeaf846&w=740"
                : "https://img.freepik.com/free-vector/stylish-faq-symbol-fluid-background-think-ask-doubt-vector_1017-45804.jpg?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
          }}
          style={gridStyle.image}
        >
          {/* Gradient overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
            style={gridStyle.gradient}
          />

          {/* Title at the bottom */}
          <View style={gridStyle.textContainer}>
            <Text style={gridStyle.itemText}>{item.assessment.name}</Text>
            {/* <Text
          style={{ marginTop: 2, color: "white", textAlign: "center" }}
          variant="bodyMedium"
        >
          Category:{item.category}
        </Text> */}
            <Text
              style={{ marginTop: 2, color: "white", textAlign: "center" }}
              variant="bodyMedium"
            >
              Difficulty:{item.difficulty}
            </Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await getPreviousQuiz(logout);
        console.log("quiz data");
        console.log(response);
        console.log("response");
        if (response) {
          setQuizData(response.data.data);
          setStatitics(response.data.rewardData);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  console.log(quizData);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      marginTopProp={0}
      headerImage={
        <Image
          source={{
            uri: "https://img.freepik.com/free-vector/gradient-black-background-with-realistic-elements_23-2149149343.jpg?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
          }}
          style={styles.topImage}
        />
      }
    >
      <Heading title="Statitics" />
      {/* <FlatList
        data={categoryData}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.title}
        numColumns={3} // Adjust this number for the desired number of columns
        // contentContainerStyle={styles.grid}
        scrollEnabled={false}
      /> */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={styles.gridItem}>
          <Text style={styles.itemText1} variant="headlineSmall">
            {statitics.totalQuizzes}
          </Text>
          <Text style={styles.itemText} variant="bodySmall">
            Total Quizzes Played
          </Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.itemText1} variant="headlineSmall">
            {statitics?.totalQuestionsAnswerd}
          </Text>
          <Text style={styles.itemText} variant="bodySmall">
            Total Questions Answered
          </Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.itemText1} variant="headlineSmall">
            {statitics?.correctQuestionsAnswerd}
          </Text>
          <Text style={styles.itemText} variant="bodySmall">
            Correct Questions Answered
          </Text>
        </View>
      </View>

      <Heading title="Previous Quizzes" />
      <FlatList
        data={quizData.length > 0 && quizData}
        renderItem={renderQuizzItem}
        keyExtractor={(item) => item._id}
        numColumns={2} // Adjust this number for the desired number of columns
        // contentContainerStyle={gridStyle.grid}
        scrollEnabled={false}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#e8e8e8",
  },
  topImage: {
    height: 200,
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  pressable: {
    flex: 1,
  },

  gridItem: {
    flexBasis: "33.3%", // Ensures each item takes up 1/4 of the row width
    flexGrow: 0, // Prevents items from expanding
    padding: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%", // Full width within the grid item
    aspectRatio: 1, // Keeps it square
  },
  itemText: {
    color: "#027bad",
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  itemText1: {
    // color: "#0",
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
});

const gridStyle = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  gridItem: {
    flexBasis: "50%", // Adjust based on desired column layout
    flexGrow: 0,
    padding: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150, // Adjust the height based on design needs
    justifyContent: "flex-end", // Ensures title is positioned at the bottom
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
  textContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  itemText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
});
