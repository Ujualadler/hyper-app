import { BASE_URL } from "@/constants/config";
import { getPreviousQuiz } from "@/Services/quizService";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Button,
  Text,
  Surface,
  Portal,
  Modal,
  Provider,
  Drawer,
  IconButton,
} from "react-native-paper";
// import Animated from "react-native-reanimated";

const { height } = Dimensions.get("window");

const QuizDrawer = ({ open, show }: any) => {
  const router = useRouter();

  const hideDrawer = () => show(false);
  const [active, setActive] = React.useState("");
  const [slideAnim] = useState(new Animated.Value(height));
  const [overlayOpacity] = useState(new Animated.Value(0));
  const [quizData, setQuizData] = useState<any>([]);
  const [statitics, setStatitics] = useState<any>("");

  useEffect(() => {
    if (open) {
      // Show drawer and overlay
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0, // Slide to visible position
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: height, // Semi-transparent overlay
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide drawer and overlay
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height, // Slide out of screen
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0, // Fully transparent
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open, slideAnim, overlayOpacity]);

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
          borderRadius: 15,
          backgroundColor: "#242439",
        }}
        elevation={2}
      >
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Image
            style={{ height: 70, width: 70, borderRadius: 15 }}
            source={{
              uri: item.assessment?.image
                ? `${BASE_URL}/quiz/${item?.assessment.image}`
                : "live" === "live"
                ? "https://img.freepik.com/free-vector/stylish-think-ask-question-mark-concept-template-design_1017-50389.jpg?t=st=1731916140~exp=1731919740~hmac=3005b0bfb66e496f48fc1786a84b5fc6801a59ed75cf102a36d275b2cdeaf846&w=740"
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
              maxWidth:170
              
            }}
          >
            <Text
              variant="bodySmall"
              style={{ fontWeight: 600, color: "#fff" }}
            >
              {item.assessment.name}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: "#7959FB", fontWeight: 500 }}
            >
              {item.difficulty.toUpperCase()}
            </Text>
            <Text variant="bodySmall" style={{ color: "white" }}>
              Finished in{" "}
              <Text variant="bodySmall" style={{ color: "#7959FB" }}>
                {(item.totalTime / 1000).toFixed(1)}s
              </Text>{" "}
              out of {(item.quizTime / 1000)}s
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            borderWidth: 1,
            borderColor: "#7959FB",
            padding: 7,
          }}
        >
          <Text variant="bodySmall" style={{ fontWeight: 700, color: "white"}}>
            {item.totalMarks}/{item.totalScore}
          </Text>
        </View>
      </Surface>
    </TouchableOpacity>
  );

  return (
    <Portal>
      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableWithoutFeedback onPress={() => show(false)}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayOpacity, // Animated opacity
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Surface style={styles.drawer}>
          <View style={{ position: "relative" }}>
            <Text style={styles.title}>MY QUIZZES</Text>
            <IconButton
              icon="close"
              iconColor="#fff" // Use the 'close' icon from Material Community Icons
              onPress={() => show(false)} // Close the modal on press
              // Optional: Add styles for positioning
              style={styles.closeButton}
            />
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
        </Surface>
      </Animated.View>
    </Portal>
  );
};

const gridStyle = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  gridItem: {
    flexBasis: "50%", // Adjust based on desired column layout
    flexGrow: 0,
    padding: 5,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 500,
    // justifyContent: "center",
    // alignItems: "center",
    // height:'100%',
    // width:'100%'
    backgroundColor: "#1A1A24",
    // zIndex: 1000,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: height * 0.9, // Drawer height
  },
  modal: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 0,
    height: "80%",
  },
  drawer: {
    backgroundColor: "#1A1A24",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    minHeight: height * 1, // Adjust the height of the drawer
    elevation: 4,
  },
  overlay: {
    position: "absolute",
    // top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Overlay background
    zIndex: 0, // Ensure it appears below the drawer
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  content: {
    fontSize: 14,
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: -5,
    // borderRadius:50,
    // borderWidth:1,
    // borderColor:'#027bad',
    color: "#027bad",
    right: -5,
  },
});

export default QuizDrawer;
