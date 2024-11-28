import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Text } from "react-native-paper";

function Header() {
  const router = useRouter();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.quizPlayed}>
          <Image
            source={{
              uri: "https://p7.hiclipart.com/preview/448/850/506/brain-incandescent-light-bulb-problem-solving-icon-bulb-creative-design-thumbnail.jpg",
            }}
            style={{ width: 30, height: 30 }}
          />
          <Text variant="bodySmall" style={styles.text}>
            Quiz Played
          </Text>
        </View>
        <Text variant="headlineSmall" style={styles.text}>
          HYPER
        </Text>
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={() => router.push('/allLeaders')}>
            <View style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Image
                source={{
                  uri: "https://img.freepik.com/free-vector/trophy_78370-345.jpg?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
                }}
                style={{ width: 30, height: 30 }}
              />
              <Text variant="bodySmall" style={styles.text}>
                55K
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Image
              source={{
                uri: "https://img.freepik.com/free-vector/wallet-money-element-illustration_32991-908.jpg?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
              }}
              style={{ width: 30, height: 30 }}
            />
            <Text variant="bodySmall" style={styles.text}>
              200
            </Text>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    zIndex: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    alignItems: "center",
    height: 70,
    backgroundColor: "transparent",
  },
  quizPlayed: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    color: "#027bad",
    fontWeight: "700", // Make sure to pass fontWeight as a string
  },
  rightContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
