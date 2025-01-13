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
import { Button, Surface, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import Heading from "@/components/Heading";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { getPreviousQuiz } from "@/Services/quizService";
import { useAuth } from "@/Context/AuthContext";
import { BASE_URL } from "@/constants/config";

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

export default function PreviousQuiz() {
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
      <Surface
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          margin: 10,
          borderRadius: 20,
          backgroundColor: "#242439",
        }}
        elevation={2}
      >
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Image
            style={{ height: 70, width: 70, borderRadius: 20 }}
            source={{
              uri:
                item.assessment?.image?
                `${BASE_URL}/quiz/${item?.assessment.image}`:"live" === "live"?
                   "https://img.freepik.com/free-vector/stylish-think-ask-question-mark-concept-template-design_1017-50389.jpg?t=st=1731916140~exp=1731919740~hmac=3005b0bfb66e496f48fc1786a84b5fc6801a59ed75cf102a36d275b2cdeaf846&w=740"
                  : "https://img.freepik.com/free-vector/stylish-faq-symbol-fluid-background-think-ask-doubt-vector_1017-45804.jpg?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
            }}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 5,
            
            }}
          >
            <Text
              variant="bodyLarge"
              style={{ fontWeight: 600, color: "#fff",maxWidth:50 }}
            >
              {item.assessment.name}
            </Text>
            <Text variant="bodySmall" style={{ color: "#7959FB",fontWeight:600 }}>
              {item.difficulty.toUpperCase()}
            </Text>
            <Text variant="bodySmall" style={{ color: "white" }}>
              Finished in <Text variant="bodySmall" style={{color:'#7959FB'}}>{item.totalTime / 1000}s</Text> out of {item.quizTime/1000}s
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            borderWidth: 3,
            borderColor: "#7959FB",
            padding: 10,
          }}
        >
          <Text variant="bodyLarge" style={{ fontWeight: 700, color: "white" }}>
            {item.totalMarks}/{item.totalScore}
          </Text>
        </View>
      </Surface>
    </TouchableOpacity>
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await getPreviousQuiz();
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
      background="#1A1A24"
      headerImage={
        <Image
          source={{
            uri: "https://img.freepik.com/free-vector/golden-crown-background-add-touch-royalty-design_1017-50125.jpg?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
          }}
          style={styles.topImage}
        />
      }
    >
      <View style={styles.container}>
        <View style={{ marginTop: 20 }}>
          <Text variant="headlineSmall" style={styles.title}>
            My Quizzes
          </Text>
          {/* <Text variant="headlineLarge" style={styles.title}>
            
          </Text> */}
          {/* <Text
              variant="bodyLarge"
              style={{ color: "white", textAlign: "center", marginBottom: 15 }}
            >
              {formattedDate}
            </Text> */}
        </View>
        {quizData.length > 0 ? (
          <FlatList
            data={quizData.length > 0 && quizData}
            renderItem={renderQuizzItem}
            keyExtractor={(item) => item._id}
            numColumns={1} // Adjust this number for the desired number of columns
            // contentContainerStyle={gridStyle.grid}
            scrollEnabled={false}
          />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 50 }}>
            Ready to Make History? Attempt Your First Quiz!
          </Text>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "SairaStencilOne",
    // padding: 16,
    backgroundColor: "#1A1A24", // Background color for the page
  },
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
  title: {
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "SairaStencilOne",
    fontWeight: "bold",
    color: "#fff", // Gold color for a standout effect
    textTransform: "uppercase", // Converts text to uppercase for a bold look
    letterSpacing: 2, // Adds spacing between letters
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Shadow for depth
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset
    textShadowRadius: 3, // Shadow blur radius
  },

  gridItem: {
    flexBasis: "33.3%", // Ensures each item takes up 1/4 of the row width
    flexGrow: 0, // Prevents items from expanding
    // padding: 10,
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
