import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button, Icon, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

function BannerComponent({ data }: any) {
  const router = useRouter()
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the glazing animation
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 4000, // Duration of one full movement
        useNativeDriver: true,
      })
    ).start();
  }, [animation]);

  // Interpolate the animation for horizontal movement
  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width], // Moves across the entire screen width
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FF785D", "#FFBE3F"]} // Golden gradient colors
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBackground}
      >
        <View style={styles.bannerContainer}>
          <Image
            style={styles.image}
            source={require("../assets/images/banner.png")}
          />
          <View style={{ marginLeft: '42%',justifyContent:'flex-end',alignItems:'flex-end' }}>
            <Text style={styles.text}>
              You've got{" "}
              <Text
                style={styles.dataText}
              >
                {data}
              </Text>{" "}
              Rewards
            </Text>
            <TouchableOpacity
            onPress={()=>router.push('/overallRank')}
              style={{
                backgroundColor: "#EBEBEB9E",
                padding: 2,
                paddingRight:7,
                borderRadius: 10,
                alignItems: "center",
                gap:3,
                justifyContent: "center",
                flexDirection: "row",
                // width:'fit-content'
              }}
            >
              <View style={styles.iconContainer}>
                <Icon
                  source="arrow-right" // React Native Paper icon name
                  size={11} // Adjust size as needed
                  color="white" // Set icon color
                />
              </View>
              <Text style={{ fontSize: 12,color:'black' }}>Check them out now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginTop: 60,
    position: "relative",
  },
  iconContainer: {
    backgroundColor: "red", // Background color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20, // Circular background
    width: 15, // Diameter of the circle
    height: 15, // Diameter of the circle
    margin:1
  },
  gradientBackground: {
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: "90%",
  },
  dataText: {
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 18,
    color: "#543CB6",
    textShadowColor: "white", // White stroke effect
    textShadowOffset: { width: 1, height: 1 }, // Stroke offset
    textShadowRadius: 5, // Stroke blur radius
  },
  bannerContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: "100%",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#FAC39E",
    position: "relative", // Ensure relative positioning for absolute child
  },
  image: {
    width: 110,
    height: 110,
    position: "absolute",
    zIndex: 10, // Ensures it appears above other elements
    top: -40, // Adjust based on your layout
    left: 10, // Center it horizontally (adjust as needed)
  },
  text: {
    color: "#A71212",
    fontSize: 15,
    fontWeight: 700,
    fontStyle: "italic",
    marginBottom: 5,
  },
});

export default BannerComponent;
