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

const RewardDrawer = ({ open, show }: any) => {
  const [statitics, setStatitics] = useState<any>("");

  const hideDrawer = () => show(false);
  const [active, setActive] = React.useState("");
  const [slideAnim] = useState(new Animated.Value(height));
  const [overlayOpacity] = useState(new Animated.Value(0));

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
        //   setQuizData(response.data.data);
          setStatitics(response.data.rewardData);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);





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
            <Text style={styles.title}>REWARDS</Text>
            <IconButton
              icon="close"
              iconColor="#fff" // Use the 'close' icon from Material Community Icons
              onPress={() => show(false)} // Close the modal on press
              // Optional: Add styles for positioning
              style={styles.closeButton}
            />
          </View>
          
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View style={styles.gridItem}>
            <Text style={styles.itemText1} variant="headlineMedium">
              {statitics?.totalpointsCollected
                ? statitics.totalpointsCollected.toFixed()
                : 0}
            </Text>
            <Text style={styles.itemText} variant="bodySmall">
              Total Points
            </Text>
          </View>
        </View>
        <Surface
          elevation={2}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 10,
            padding: 15,
            borderRadius: 10,
            backgroundColor: "black",
          }}
        >
          <Text variant="bodySmall" style={styles.itemText}>Correct Questions Answered</Text>
          <Text variant="bodySmall" style={styles.itemText1}>
            {statitics?.correctQuestionsAnswerd || 0}
          </Text>
        </Surface>
        <Surface
          elevation={2}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 10,
            padding: 15,
            borderRadius: 10,
            backgroundColor: "black",
          }}
        >
          <Text style={styles.itemText}>Total Questions Answered</Text>
          <Text style={styles.itemText1}>
            {statitics?.totalQuestionsAnswerd || 0}
          </Text>
        </Surface>
        <Surface
          elevation={2}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 10,
            padding: 15,
            borderRadius: 10,
            backgroundColor: "black",
          }}
        >
          <Text style={styles.itemText}>Total Quizzes Played</Text>
          <Text style={styles.itemText1}> {statitics?.totalQuizzes || 0}</Text>
        </Surface>
        </Surface>
      </Animated.View>
    </Portal>
  );
};



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
  gridItem: {
    // flexBasis: "100%", // Ensures each item takes up 1/4 of the row width
    // flexGrow: 0, // Prevents items from expanding
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    height: 100,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#6846f3",
    margin: 10,
  },
  itemText1: {
    color: "#6846f3",
    fontWeight: "700",
    textAlign: "center",
  },
  itemText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
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

export default RewardDrawer;
