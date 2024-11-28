import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  BackHandler,
} from "react-native";
import { Button, IconButton, RadioButton, Text } from "react-native-paper";
import { getQuiz, submitAnswers } from "@/Services/quizService";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import HTMLView from "react-native-htmlview";
import Timer from "@/components/Timer";
import { useAuth } from "@/Context/AuthContext";
import * as Haptics from "expo-haptics";
import { ScrollView } from "react-native-gesture-handler";
import ParallaxScrollView from "@/components/ParallaxScrollView";

const Quiz: React.FC = () => {
  const { id } = useLocalSearchParams();
  const { userName } = useAuth();
  const router = useRouter();
  const [quizData, setQuizData] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [startAssessment, setStartAssessment] = useState<any>("");
  const [markData, setMarkData] = useState<any>("");
  const [assessmentId, setAssessmentid] = useState<string>("");
  const [totalTime, setTotalTime] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>('');

  // Timer state
  const [timer, setTimer] = useState<number | null>(null); // Timer starts as null
  const [showTimer, setShowTimer] = useState<boolean>(true); // Timer starts as null

  // Track the start time for each question

  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now()
  );

  console.log(questionStartTime);

  console.log(totalTime);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true // Prevent back navigation
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await getQuiz(id as any,'normal');
        setQuizData(response);
        setAssessmentid(response._id);
        setDifficulty(response.difficulty);
        router.setParams({ quizName: response.name });
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  // Safely get the current question

  const currentQuestion = useMemo(
    () => quizData?.questions?.[currentQuestionIndex] || null,
    [quizData, currentQuestionIndex]
  );

  // Initialize the timer when quizData or the first question is loaded
  useEffect(() => {
    if (quizData && currentQuestionIndex === 0 && timer === null) {
      const firstQuestionTime = parseInt(quizData.questions[0].time, 10) || 30;
      console.log("Initializing Timer for First Question:", firstQuestionTime);
      setTimer(firstQuestionTime);
      setQuestionStartTime(Date.now());
    }
  }, [quizData, currentQuestionIndex, timer]);

  // Update the timer whenever the current question changes
  useEffect(() => {
    if (currentQuestion && timer === null) {
      const questionTime = parseInt(currentQuestion.time, 10) || 30;
      setTimer(questionTime);
    }
  }, [currentQuestion, timer]);

  // Countdown effect
  useEffect(() => {
    if (timer !== null && timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => (prevTimer !== null ? prevTimer - 1 : null));
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (timer === 0) {
      if (currentQuestionIndex < quizData.questions.length - 1) {
        console.log(
          "Switching to Next Question. Current Index:",
          currentQuestionIndex
        );
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setTimer(null); // Reset timer for the next question
      } else if (currentQuestionIndex === quizData.questions.length - 1) {
        console.log("Submitting Quiz...");
        setShowTimer(false);
        handleSubmit(); // Submit only on the last question
      }
    }
  }, [timer, currentQuestionIndex, quizData]);

  const handleResponseChange = (type: string, value: any, option?: string) => {
    if (!currentQuestion) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const currentTime = Date.now();
    const timeTaken = currentTime - questionStartTime;

    setTotalTime((prev: any) => prev + timeTaken); // Accumulate the total time
    setQuestionStartTime(currentTime);

    setResponses((prev) => {
      const updatedResponse = { ...prev[currentQuestion._id] };

      if (type === "multipleChoice") {
        const selectedOptions = updatedResponse.selectedOptions || [];
        updatedResponse.selectedOptions = selectedOptions.includes(option)
          ? selectedOptions.filter((opt: any) => opt !== option)
          : [...selectedOptions, option];
      } else {
        updatedResponse[type] = value;
      }

      return { ...prev, [currentQuestion._id]: updatedResponse };
    });
  };

  const handleSubmit = async () => {
    setStartAssessment("loading");

    // Transform responses into the required answers array format
    const answers = Object.entries(responses).map(([questionId, value]) => ({
      questionId, // Question ID from the key
      ...value, // Spread the value containing the selected option
    }));

    try {
     
      const result = await submitAnswers({
        quizId: assessmentId, // Pass the assessment ID
        totalTime: totalTime,
        difficulty: difficulty,
        answers, // Pass the transformed answers
      });
      console.log(result.data.markData);
      if (result.success) {
        setMarkData(result.data.markData); // Set the returned mark data
      } else {
        // toast.error("There was an error submitting the assessment."); // Handle submission error
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      //   toast.error("There was an error submitting the assessment."); // Show a toast notification
      //   setStartAssessment("error");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading quiz...</Text>
      </View>
    );
  }

  if (!quizData?.questions || quizData.questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No questions available for this quiz.</Text>
      </View>
    );
  }

  return (
   <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      marginTopProp={0}
      background="#ffbc38"
      headerImage={
        <Image
          source={{
            uri: "https://img.freepik.com/free-vector/multicolored-flowing-figure-neon-style_74855-1425.jpg?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
          }}
          style={styles.topImage}
        />
      }
    >
      <View style={styles.container}>
        {showTimer ? (
          <View style={styles.questionContainer}>
            {/* Display countdown timer */}
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              {showTimer && (
                <Timer
                  showTimer={showTimer}
                  timer={timer as any} // Current timer value
                  initialTime={currentQuestion?.time || 5} // Total duration for the question
                  questionKey={currentQuestionIndex.toString()} // Unique key for each question
                />
              )}
            </View>

            <Text
              variant="bodyMedium"
              style={{
                textAlign: "center",
                fontWeight: "700",
                color: "#7f66ff",
              }}
            >
              Question {currentQuestionIndex + 1} of{" "}
              {quizData?.questions.length}
            </Text>

            {/* Render question */}
            {currentQuestion && (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <HTMLView
                  value={currentQuestion.text}
                  stylesheet={htmlStyles}
                />
              </View>
            )}

            {/* Render options */}
            {currentQuestion?.type === "singleChoice" &&
              currentQuestion.options.map((option: any) => {
                const isOptionSelected =
                  responses[currentQuestion._id]?.selectedOption !== undefined; // Check if any option is already selected for the current question

                const isChecked =
                  responses[currentQuestion._id]?.selectedOption ===
                  option.text; // Check if the current option is selected

                return (
                  <TouchableOpacity
                    key={option._id}
                    style={[
                      styles.optionContainer,
                      isChecked && styles.selectedOptionContainer, // Highlight selected option
                    ]}
                    onPress={() => {
                      if (!isOptionSelected) {
                        handleResponseChange("selectedOption", option.text);
                      }
                    }}
                    disabled={isOptionSelected} // Prevent interaction once an option is selected
                  >
                    <RadioButton
                      value={option.text}
                      status={isChecked ? "checked" : "unchecked"} // Only show checked for the selected option
                      onPress={() => {
                        if (!isOptionSelected) {
                          handleResponseChange("selectedOption", option.text);
                        }
                      }}
                      color="#ffffff" // Color for the selected radio button
                      disabled={isOptionSelected} // Disable interaction after an option is selected
                    />
                    <Text
                      style={[
                        styles.optionText,
                        isChecked && styles.selectedOptionText, // Highlight selected option text
                      ]}
                    >
                      {option.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        ) : (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <View
              style={{
                margin: 2,
                marginBottom: 10,
                borderRadius: 15,
                backgroundColor: "red",
                overflow: "hidden",
              }}
            >
              <View
                style={{ backgroundColor: "red", width: "100%", padding: 20 }}
              >
                <Text
                  variant="bodyLarge"
                  style={{ color: "white", fontWeight: 700, textAlign: "left" }}
                >
                  {/* {markData.totalMarks}/{markData.totalScore} */}
                  Correct Answer {markData?.totalMarks}/{markData?.totalScore}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 15,
                  padding: 10,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.hexagon}>
                    <View style={styles.hexagonMiddle}>
                      <Text
                        variant="headlineSmall"
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontWeight: 600,
                          marginTop: 20,
                        }}
                      >
                        {userName}
                      </Text>
                      <Text
                        variant="bodyMedium"
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontWeight: 700,
                        }}
                      >
                        Rank
                      </Text>
                      <Text
                        variant="headlineLarge"
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontWeight: 700,
                        }}
                      >
                        {markData?.rank}
                      </Text>
                    </View>
                    <View style={styles.hexagonBottom} />
                  </View>
                </View>

                <Text
                  variant="titleLarge"
                  style={{
                    color: "Black",
                    fontWeight: 600,
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  Congratulations,You've completed this quiz!
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: "#bcbcbc",
                    fontWeight: 700,
                    textAlign: "center",
                    paddingHorizontal: 40,
                    marginVertical: 20,
                  }}
                >
                  Let's keep testing your Knowledge by playing more quizzes!
                </Text>
                <Button
                  onPress={() => router.push("/" as any)}
                  style={{ marginTop: 10, backgroundColor: "red" }}
                  mode="contained"
                >
                  Explore More
                </Button>
                <Button
                  onPress={() =>
                    router.push({
                      pathname: "/leaderboard/[id]" as any,
                      params: { id: id },
                    })
                  }
                  style={{ marginTop: 10, backgroundColor: "#3498db" }}
                  mode="contained"
                >
                  View Leaderboard
                </Button>
              </View>
            </View>
            {/* <Text
            variant="titleLarge"
            style={{ color: "white", fontWeight: 700, textAlign: "center" }}
          >
            Well Played!
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: "white", fontWeight: 700, textAlign: "center" }}
          >
            Your Score
          </Text> */}
          </View>
        )}
      </View>
    </ParallaxScrollView>
  );
};

const htmlStyles = StyleSheet.create({
  p: {
    fontSize: 22,
    lineHeight: 35,
    fontWeight: "600",
    color: "#111",
    marginVertical: 24,
  },
});

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#ffbc38" },
  topImage: {
    height: 200,
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  questionContainer: { marginBottom: 16 },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f0f0f0",
    marginBottom: 12,
    borderRadius: 14,
  },
  selectedOptionContainer: {
    backgroundColor: "#7f66ff", // Highlight background color when selected
    color: "white",
    borderRadius: 14,
  },
  optionText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "left",
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "left",
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  hexagon: {
    width: 100, // Total width of the hexagon
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  hexagonMiddle: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: 160, // Full width
    height: 150, // Middle height
    backgroundColor: "#3498db", // Color of the hexagon
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  hexagonBottom: {
    width: 0,
    height: 0,
    // borderRadius:4,
    borderLeftWidth: 80, // Half the total width
    borderLeftColor: "transparent",
    borderRightWidth: 80,
    borderRightColor: "transparent",
    borderTopWidth: 40, // Height of the triangle
    borderTopColor: "#3498db", // Color of the hexagon
  },
});

export default Quiz;
