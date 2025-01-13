import {
  Image,
  StyleSheet,
  View,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Modal,
  BackHandler,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Svg, { Path } from "react-native-svg";
import {
  Banner,
  Button,
  Divider,
  Icon,
  IconButton,
  Menu,
  Provider,
  Surface,
  Text,
} from "react-native-paper";
import { useFocusEffect, useRouter } from "expo-router";
import Heading from "@/components/Heading";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/Context/AuthContext";
import { getAllQuiz, getPreviousQuiz } from "@/Services/quizService";
import { BASE_URL } from "@/constants/config";
import { handleLogout } from "@/constants/Logout";
import BannerComponent from "@/components/BannerComponent";
import QuizDrawer from "@/components/QuizDrawer";
import SearchScrollView from "@/components/SearchScrollView";
import RewardDrawer from "@/components/RewardDrawer";

const categoryData = [
  {
    title: "All",
    category: "all",
    image: require("../../assets/images/all1.png"), // Use static require for local images
    active: require("../../assets/images/all2.png"),
  },
  {
    title: "Live",
    category: "live",
    image: require("../../assets/images/live1.png"),
    active: require("../../assets/images/live2.png"),
  },
  {
    title: "Practice",
    category: "practice",
    image: require("../../assets/images/practice1.png"),
    active: require("../../assets/images/practice2.png"),
  },
];

function timeFromNow(time: string): string {
  const timeInMillis = new Date(time).getTime();
  const nowInMillis = Date.now();
  const diffInMillis = nowInMillis - timeInMillis;

  // Convert to seconds, minutes, hours, days, etc.
  const seconds = Math.floor(diffInMillis / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { userName, accessToken, logout } = useAuth();
  const [quizData, setQuizData] = useState<any>([]);
  const [quizCategory, setQuizCategory] = useState<string>("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState("Easy"); // Start with "Easy"
  const [statitics, setStatitics] = React.useState<any>(null);
  const [showQuizzes, setShowQuizzes] = React.useState<boolean>(false);
  const [showReward, setShowReward] = React.useState<boolean>(false);
  const [isViewAll, setIsViewAll] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>("");

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

  const handleSelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setModalVisible(false); // Close the modal after selection
  };



  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Prevent back navigation
        return true; // Returning true prevents back navigation
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => {
        subscription.remove(); // Cleanup on unmount
      };
    }, [])
  );



  useEffect(() => {
    (async () => {
      try {
        setAppIsReady(false);
        const response = await getAllQuiz(
          logout,
          quizCategory,
          selectedDifficulty,
          searchText
        );

        if (response) {
          setQuizData(response.data);
          setIsViewAll(false);
          setAppIsReady(true);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [quizCategory, selectedDifficulty, searchText]);

  const maxVisibleItems = 6;

  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => setQuizCategory(item.category)} // This updates the state
    >
      <Surface
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          margin: 0,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#6846f3",
          backgroundColor:
            item.category === quizCategory ? "#6846f3" : "transparent",
        }}
        elevation={0}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Image
            style={{
              height: 15,
              width: 15,
            }}
            source={item.category === quizCategory ? item.active : item.image}
          />
          <Text
            style={{
              ...styles.itemText,
              color: item.category === quizCategory ? "#fff" : "#6846f3", // Change color based on selection
            }}
            variant="bodySmall"
          >
            {item.title}
          </Text>
        </View>
      </Surface>
    </TouchableOpacity>
  );

  const renderAssessmentItem = ({ item }: any) => (
    <TouchableOpacity
      // style={gridStyle.pressable}
      style={{ width: 95, marginRight: 10 }}
      onPress={() =>
        router.push({
          pathname: "/instruction/[id]" as any,
          params: { id: item._id },
        })
      }
    >
      <Surface style={gridStyle.gridItem}>
        <ImageBackground
          source={{
            uri: item.image
              ? `${BASE_URL}/quiz/${item.image}`
              : item.category === "live"
              ? "https://img.freepik.com/free-vector/stylish-think-ask-question-mark-concept-template-design_1017-50389.jpg?t=st=1731916140~exp=1731919740~hmac=3005b0bfb66e496f48fc1786a84b5fc6801a59ed75cf102a36d275b2cdeaf846&w=740"
              : "https://img.freepik.com/free-vector/stylish-faq-symbol-fluid-background-think-ask-doubt-vector_1017-45804.jpg?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
          }}
          style={gridStyle.image}
        >
          {/* Gradient overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.4)"]}
            style={gridStyle.gradient}
          />

          {/* Title at the bottom */}
          <View style={gridStyle.textContainer}>
            <Text style={gridStyle.itemText} variant="bodySmall">
              {item?.name}
            </Text>
            <Text
              style={{
                marginTop: 2,
                color: "white",
                textAlign: "center",
                fontSize: 10,
              }}
              variant="bodySmall"
            >
              {timeFromNow(item.createdAt)}
            </Text>
          </View>
        </ImageBackground>
      </Surface>
    </TouchableOpacity>
  );

  const renderQuizCategory = ({ item, color = "black" }: any) => (
    <View style={{ marginBottom: 20 }}>
      <Text
        variant="bodyMedium"
        style={{
          fontWeight: "bold",
          marginLeft: 13,
          color:
            quizCategory === "all" &&
            item.assessments[0]?.category === "practice"
              ? "white"
              : color,
          textTransform: "capitalize",
        }}
      >
        {item.quizCategory}
      </Text>
      <FlatList
        data={item.assessments}
        horizontal
        keyExtractor={(assessment) => assessment._id}
        renderItem={renderAssessmentItem} // Updated function
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10, paddingLeft: 10 }}
      />
    </View>
  );

  const renderCategory = ({ item }: any) => (
    <View style={{ marginBottom: 20 }}>
      {/* <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
        {item.category === "live" ? "Live Quizzes" : "Practice Quizzes"}
      </Text> */}
      <FlatList
        data={item.quizzes}
        keyExtractor={(quiz) => quiz.quizCategory}
        renderItem={renderQuizCategory}
      />
    </View>
  );

  return (
    <Provider>
      <SearchScrollView
        statics={true}
        headerHeight={320}
        showQuizzes={showQuizzes}
        showReward={showReward}
        searchText={searchText}
        setSearchText={setSearchText}
        setShowQuizzes={setShowQuizzes}
        setShowReward={setShowReward}
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        marginTopProp={0}
        headerImage={
          <Image
            source={require("../../assets/images/homePage.png")}
            style={styles.topImage}
          />
        }
      >
        {showQuizzes && <QuizDrawer open={showQuizzes} show={setShowQuizzes} />}
        {showReward && <RewardDrawer open={showReward} show={setShowReward} />}

        <View
          style={{
            paddingBottom: 55,
            backgroundColor: "#fff",
            // paddingTop: 35,
          }}
        >
          <DifficultyComponent
            handleSelect={handleSelect}
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
            selectedDifficulty={selectedDifficulty}
            buttonText={buttonText}
          />
          <View>
            <FlatList
              data={categoryData}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.title}
              numColumns={3} // Adjust this number for the desired number of columns
              scrollEnabled={false}
              style={{ marginLeft: 10 }}
            />
          </View>
          {quizCategory !== "all" && (
            <Heading
              color="#111"
              title={
                quizCategory === "practice"
                  ? "Practice Quizzes"
                  : quizCategory === "live"
                  ? "Live Quizzes"
                  : ""
              }
            />
          )}
          {quizCategory !== "all" && quizData?.length > 0 && (
            <FlatList
              data={quizData?.length > 0 ? quizData : []}
              renderItem={renderCategory}
              keyExtractor={(item) => item._id}
              numColumns={3} // Adjust this number for the desired number of columns
              // contentContainerStyle={gridStyle.grid}
              scrollEnabled={false}
              style={{ paddingHorizontal: 10 }}
            />
          )}
          {quizCategory === "all" && (
            <>
              <Heading color="#111" title={"Get Set Quizzy!"} />
              <FlatList
                data={
                  isViewAll
                    ? quizData.filter((data: any) => data.category === "live") // Show all quizzes if "View All" is clicked
                    : quizData
                        .filter((data: any) => data.category === "live")
                        ?.slice(0, maxVisibleItems)
                }
                renderItem={renderCategory}
                keyExtractor={(item) => item._id}
                numColumns={3} // Adjust this number for the desired number of columns
                scrollEnabled={false}
                style={{ paddingHorizontal: 10 }}
              />
              {/* {(quizAllData?.live?.length>maxVisibleItems && isViewAll!=='live') && */}

              {/* {!isViewAll && quizAllData?.live?.length > maxVisibleItems && (
                <Button
                  mode="text"
                  textColor="black"
                  onPress={() => setIsViewAll(true)} // Update state to show all items
                >
                  View All
                </Button>
              )} */}

              <BannerComponent
                data={
                  statitics?.totalpointsCollected
                    ? statitics.totalpointsCollected.toFixed()
                    : 0
                }
              />
              <LinearGradient
                colors={[
                  "#4A32AD", // Dark purple
                  "#5F43D4", // Intermediate purple
                  "#7B5CFC", // Lighter purple
                  "#A389FF", // Soft light purple
                  "#D4C7FF", // Very light purple
                  "#FFFFFF", // White at the end
               
                ]}
                locations={[0, 0.2, 0.4, 0.6, 0.8, 1]} // Evenly distribute gradient stops
                start={{ x: 0, y: 0 }} // Start at the top
                end={{ x: 0, y: 1 }} // End at the bottom
                style={{ flex: 1 }} // Adjust to your design needs
              >
                <View
                  style={{
                    // backgroundColor: "black",
                    paddingBottom: 65,
                    paddingBlock: 50,
                    // marginBottom: 10,
                  }}
                >
                  {/* <Svg
                    height="90"
                    width="100%"
                    style={styles.curveBottom}
                    viewBox="0 0 100 15"
                  >
                    <Path
                      d="M0,20 Q50,0 100,20"
                      fill="#fff" // Replace with your desired background color
                    />
                  </Svg> */}
                  <Heading title={"Practice Makes You a Quiz Champion!"} />

                  <FlatList
                    data={
                      isViewAll
                        ? quizData.filter(
                            (data: any) => data.category === "practice"
                          ) // Show all quizzes if "View All" is clicked
                        : quizData
                            .filter((data: any) => data.category === "practice")
                            ?.slice(0, maxVisibleItems)
                    }
                    renderItem={renderCategory}
                    keyExtractor={(item) => item._id}
                    numColumns={3} // Adjust this number for the desired number of columns
                    scrollEnabled={false}
                    style={{ paddingHorizontal: 10 }}
                  />
                  <Svg
                    height="54"
                    width="100%"
                    style={styles.curveTop}
                    viewBox="0 0 100 15"
                  >
                    <Path
                      d="M0,0 Q50,20 100,0"
                      fill="#fff" // Replace with your desired background color
                    />
                  </Svg>
                </View>
              </LinearGradient>
            </>
          )}
        </View>
      </SearchScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    // flex: 1,
    backgroundColor: "rgba(155, 131, 253, 0.5)",
    flexDirection: "row",
    // gap: 10,
    width: "95%",
    // marginTop: 10,
    top: 180,
    zIndex: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#6846f3",
  },
  curveTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  curveBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  button: {
    // backgroundColor: "#28a0f6",
    display: "flex",
    flex: 1,
    gap: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    color: "white",
    fontSize: 12,
    width: "30%",
    textTransform: "capitalize",
  },
  topImage: {
    height: 320,
    width: "100%",
    position: "absolute",
    // borderRadius: 20,
    zIndex: 1,
    bottom: 0,
    left: 0,
  },

  gridItem: {
    // flexBasis: "33.3%", // Ensures each item takes up 1/4 of the row width
    flexGrow: 0, // Prevents items from expanding
    padding: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: "60%", // Full width within the grid item
    aspectRatio: 1, // Keeps it square
  },
  itemText: {
    color: "#027bad",
    fontWeight: "700",
    marginTop: 0,
    textAlign: "center",
  },

  modalBackground: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1A1A24",
    padding: 20,
    borderRadius: 8,
    width: 250,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "darkGrey",
    borderStyle: "dashed",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    // borderRadius:50,
    // borderWidth:1,
    // borderColor:'#027bad',
    color: "#027bad",
    right: 0,
  },
  optionText: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
  },
});

const gridStyle = StyleSheet.create({
  pressable: {
    flex: 1,
    borderRadius: 10,
    padding: 5,
    marginVertical: 5,
    maxWidth: "33.3%",
  },
  gridItem: {
    flexBasis: "33.3%", // Adjust based on desired column layout
    flexGrow: 0,

    // padding: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    borderRadius: 20,
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
    textAlign: "center",
  },
});

function DifficultyComponent({
  handleSelect,
  selectedDifficulty,
  modalVisible,
  setModalVisible,
  buttonText,
}: any) {
  // const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <View style={DifficultyStyles.container}>
        <View style={DifficultyStyles.wrapper}>
          {/* SVG Shape */}
          <Svg width="100%" height="100%" viewBox="0 0 100 12">
            <Path
              d="M0 0 L100 0 Q85 40 50 30 Q15 40 0 0 Z"
              fill="rgba(128, 128, 128, 1)"
              // stroke={'#6846f3'}
              // strokeWidth={.5}
            />
          </Svg>

          {/* Content inside the shape */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={DifficultyStyles.content}
          >
            <Text style={DifficultyStyles.text}>
              Level :{" "}
              {selectedDifficulty === "medium"
                ? "Medium"
                : selectedDifficulty === "hard"
                ? "Hard"
                : selectedDifficulty === "easy"
                ? "Easy"
                : "All"}
            </Text>
            <View style={{ marginTop: 3 }}>
              <Icon
                source="chevron-down" // React Native Paper icon name
                size={18} // Adjust size as needed
                color="#fff" // Set icon color
                // style={{color:'blue'}}
                // style={DifficultyStyles.icon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <IconButton
              icon="close"
              iconColor="#6846f3" // Use the 'close' icon from Material Community Icons
              onPress={() => setModalVisible(false)} // Close the modal on press
              style={styles.closeButton} // Optional: Add styles for positioning
            />
            <TouchableOpacity
              onPress={() => handleSelect("")}
              style={{ ...styles.option, marginTop: 10 }}
            >
              <Text
                style={{
                  ...styles.optionText,
                  color: selectedDifficulty === "" ? "#6846f3" : "white",
                }}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSelect("easy")}
              style={styles.option}
            >
              <Text
                style={{
                  ...styles.optionText,
                  color: selectedDifficulty === "easy" ? "#6846f3" : "white",
                }}
              >
                Easy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSelect("medium")}
              style={styles.option}
            >
              <Text
                style={{
                  ...styles.optionText,
                  color: selectedDifficulty === "medium" ? "#6846f3" : "white",
                }}
              >
                Medium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSelect("hard")}
              style={styles.option}
            >
              <Text
                style={{
                  ...styles.optionText,
                  color: selectedDifficulty === "hard" ? "#6846f3" : "white",
                }}
              >
                Hard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const DifficultyStyles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  wrapper: {
    width: "50%",
    height: 30,
    overflow: "hidden",
    paddingTop: -4,
    position: "relative", // Allows content to be positioned within the shape
  },
  content: {
    position: "absolute", // Overlay on top of the SVG
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    color: "white",
    fontSize: 11,
    marginTop: 2,
    fontWeight: 600,
    // marginBottom:2
  },
  icon: {
    marginTop: 5, // Add space between text and icon
  },
});
