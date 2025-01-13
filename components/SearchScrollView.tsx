import type { PropsWithChildren, ReactElement } from "react";
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
  Animated as RNAnimated,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
  Extrapolate,
  Extrapolation,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { Searchbar, Text, TextInput } from "react-native-paper";
import React, { useEffect, useRef, useState } from "react";
import { getPreviousQuiz } from "@/Services/quizService";
import { useRouter } from "expo-router";
import QuizDrawer from "./QuizDrawer";

const HEADER_HEIGHT = 200;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  marginTopProp: number;
  headerHeight?: number;
  setSearchText?: any;
  searchText?: string;
  background?: string;
  statics?: boolean;
  setShowQuizzes?: any;
  setShowReward?: any;
  showReward?: any;
  showQuizzes?: any;
}>;

export default function SearchScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  marginTopProp,
  headerHeight = 200,
  statics = false,
  showQuizzes,
  showReward,
  setShowQuizzes,
  searchText,
  setSearchText,
  setShowReward,
  background = "#fff",
}: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [statitics, setStatitics] = React.useState<any>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [scrollDirection, setScrollDirection] = useState(1);
  const [searchBarOpacity, setSearchBarOpacity] = useState(1);

  const previousScrollPosition = useRef(0);

  const handleScroll = (event: any) => {
    const currentScrollPosition = event.nativeEvent.contentOffset.y;

    if (currentScrollPosition > previousScrollPosition.current + 10) {
      // Scrolling down
      if (searchBarOpacity !== 0) setSearchBarOpacity(0);
    } else if (currentScrollPosition < previousScrollPosition.current) {
      // Scrolling up
      if (searchBarOpacity !== 1) setSearchBarOpacity(1);
    }

    // Update previous scroll position
    previousScrollPosition.current = currentScrollPosition;
  };

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

  // Update visibility of the search bar based on scroll direction

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
      //   position:'relative',
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
      flex: 1,
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
      <View style={{ position: "relative" }}>
        <View
          style={[
            {
              padding: 5,
              paddingHorizontal: 15,
              position: "absolute",
              zIndex: 100,
              width: "100%",
              top: 40,
              opacity: searchBarOpacity,
            },
            //  searchAnimatedStyle
          ]}
        >
          {/* <Searchbar
            placeholder="Search"
            onChangeText={setSearchText}
            value={searchText as any}
            inputStyle={{ textAlignVertical: "center", padding: 0 }}
            style={{
              backgroundColor: "#fff",
              height: 48,
              borderRadius: 15,
              elevation: 10,
              borderWidth: 1,
              borderColor: "grey",
              textAlignVertical: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          /> */}
          <TextInput
            placeholder="Search"
            placeholderTextColor="grey" // Adjust placeholder color for visibility
            textColor="black" // Adjust text color for user input
            mode="outlined" // Outlined mode for better aesthetics
            onChangeText={setSearchText} // Updates search text state
            value={searchText} // Binds the current search text
            autoCapitalize="none" // Prevents automatic capitalization
            style={{
              backgroundColor: "#fff", // Background color for the input
              borderRadius: 30, // Rounded input corners
              height: 48, // Adjusted height for a compact design // Thin border for a cleaner look
              borderColor: "#fff", // Border color matches theme
              paddingHorizontal: 5, // Ensures consistent padding
              fontSize: 16, // Optimal font size
            }}
            theme={{
              roundness: 30, // Ensures the roundness theme matches styles
              colors: {
                primary: "#6846f3", // Primary color for focus/outline
              },
            }}
            left={
              <TextInput.Icon
                color="#6846f3" // Matches the theme
                icon="magnify" // Uses Material Design "search" icon
              />
            }
            right={
              searchText !== "" && (
                <TextInput.Icon
                  onPress={() => setSearchText("")}
                  size={14}
                  color="#6846f3" // Matches the theme
                  icon="close" // Uses Material Design "search" icon
                />
              )
            }
          />
        </View>
      </View>
      <Animated.ScrollView
        //  style={{ flex: 1 }}
        style={styles.contentContainer}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        // contentContainerStyle={{ paddingBottom: 600 }}
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
                  onPress={() => setShowReward(true)}
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
    top: 265,
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
