import type { PropsWithChildren, ReactElement } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { Text } from "react-native-paper";
import React, { useEffect } from "react";
import { getPreviousQuiz } from "@/Services/quizService";
import { useRouter } from "expo-router";
import QuizDrawer from "./QuizDrawer";

const HEADER_HEIGHT = 200;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  marginTopProp: number;
  headerHeight?: number;
  background?: string;
  statics?: boolean;
  setShowQuizzes?: any;
  showQuizzes?: any;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  marginTopProp,
  headerHeight = 200,
  statics = false,
  showQuizzes,
  setShowQuizzes,
  background = "#1A1A24",
}: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const router = useRouter();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
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

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,

      marginTop: marginTopProp,
      // marginBottom:55,
      backgroundColor: "#1A1A24",
    },
    header: {
      height: 200,
      // margin:10,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 30,
      borderBottomLeftRadius: 30,
      overflow: "hidden",
    },
    contentContainer: {
      position: "relative",
    },
    content: {
      flex: 1,
      // padding: 15,
      gap: 16,
      overflow: "hidden",
    },
  });

  return (
    <ThemedView style={{ ...styles.container, backgroundColor: background }}>
      <Animated.ScrollView
        style={styles.contentContainer}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[
            styles.header,
            {
              backgroundColor: headerBackgroundColor[colorScheme],
              height: headerHeight,
            },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
          {statics && (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemedView style={stylesBar.stepContainer}>
                <TouchableOpacity
                  style={stylesBar.button}
                  onPress={() => router.push("/overallRank")}
                >
                  <Text
                    variant="bodyMedium"
                    style={{ color: "white", fontWeight: 700 }}
                  >
                    {statitics?.currentRank ? statitics.currentRank : 0}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: "white", fontWeight: 500, fontSize: 10 }}
                  >
                    Hyper Standings
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={stylesBar.button}
                  onPress={() => router.push("/reward")}
                >
                  <Text
                    variant="bodyMedium"
                    style={{ color: "white", fontWeight: 700 }}
                  >
                    {" "}
                    {statitics?.totalpointsCollected
                      ? statitics.totalpointsCollected.toFixed()
                      : 0}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: "white", fontWeight: 500, fontSize: 10 }}
                  >
                    Rewards
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={stylesBar.button}
                  onPress={() => setShowQuizzes(true)}
                >
                  <Text
                    variant="bodyMedium"
                    style={{ color: "white", fontWeight: 700 }}
                  >
                    {statitics?.totalQuizzes || 0}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: "white", fontWeight: 500, fontSize: 10 }}
                  >
                    Games Played
                  </Text>
                </TouchableOpacity>
              </ThemedView>
            </View>
          )}
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const stylesBar = StyleSheet.create({
  stepContainer: {
    // flex: 1,
    backgroundColor: "rgba(155, 131, 253, 0.5)",
    flexDirection: "row",
    // gap: 10,
    width: "95%",
    // marginTop: 10,
    top: 148,
    zIndex: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#6846f3",
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
    height: 200,
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
    padding: 5,
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
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: 250,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ffbc38",
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
    color: "#027bad",
    textAlign: "center",
  },
});
