import ParallaxScrollView from "@/components/ParallaxScrollView";
import { BASE_URL } from "@/constants/config";
import { getRankList } from "@/Services/quizService";
import { useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Text, DataTable } from "react-native-paper";

function Leaderboard() {
  const { id } = useLocalSearchParams();
  const [rankData, setRankData] = useState<any>([]);
  const [userId, setUserId] = useState<string>("");

  const today = new Date();

  // Format the date
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options as any);

  useEffect(() => {
    (async () => {
      try {
        const response = await getRankList(id as string);
        if (response) {
          setRankData(response.data.data);
          setUserId(response.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      marginTopProp={0}
      background="#1A1A24"
      headerImage={
        <Image
          source={{
            uri: "https://img.freepik.com/premium-photo/winners-podium-1-2-3-gold-podium-dark-abstract-look-background-empty-space-platform-3d_394271-2580.jpg?ga=GA1.1.563629714.1713778942&semt=ais_hybrid",
          }}
          style={styles.topImage}
        />
      }
    >
      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          STANDINGS
        </Text>
        <Text
          variant="bodyLarge"
          style={{ color: "white", textAlign: "center", marginBottom: 15 }}
        >
          {formattedDate}
        </Text>

        {/* <ScrollView> */}
        <DataTable style={styles.table}>
          <DataTable.Header style={styles.header}>
            <DataTable.Title>
              <Text style={styles.headerText}>POS</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.headerText}>NAME</Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text style={styles.headerText}>POINTS</Text>
            </DataTable.Title>
            {/* <DataTable.Title numeric>
                <Text style={styles.headerText}>Time</Text>
              </DataTable.Title> */}
          </DataTable.Header>

          {rankData.map((item: any, index: number) => (
            <DataTable.Row
              key={index}
              style={{
                ...styles.row,
                backgroundColor: item.user === userId ? "black" : "",
                borderWidth: item.user === userId ? 1 : 0,
                // borderColor: item.user === userId ? "#ffe600" : "",
                borderRadius: item.user === userId ? 10 : 0,
              }}
            >
                             <DataTable.Cell
                //   style={{
                //     display: "flex",
                //     justifyContent: "flex-start",
                //     alignItems: "center",
                //   }}
                >
                  {item.rank === 1 ? (
                    <LottieView
                      source={require("../../assets/images/gold.json")}
                      autoPlay
                      style={{ width: 30, height: 30 }}
                      loop
                    />
                  ) : item.rank === 2 ? (
                    <LottieView
                      source={require("../../assets/images/silver.json")}
                      autoPlay
                      style={{ width: 30, height: 30 }}
                      loop
                    />
                  ) : item.rank === 3 ? (
                    <LottieView
                      source={require("../../assets/images/bronze.json")}
                      autoPlay
                      style={{ width: 30, height: 30 }}
                      loop
                    />
                  ) : (
                    <Text style={{ ...styles.cellText,marginLeft:10}}>{item.rank}</Text>
                  )}
                </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.cellText}>{item.userName}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={styles.cellText}>
                  {item.combinedSortField.toFixed(1)}
                </Text>
              </DataTable.Cell>
              {/* <DataTable.Cell numeric>
                  <Text style={styles.cellText}>
                    {(item.totalTime / 1000).toFixed(1)}s
                  </Text>
                </DataTable.Cell> */}
            </DataTable.Row>
          ))}
        </DataTable>
        {/* </ScrollView> */}
      </View>
    </ParallaxScrollView>
  );
}

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1A1A24",
  },
  topImage: {
    height: 200,
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  title: {
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
    color: "#fff", // Gold color for a standout effect
    textTransform: "uppercase", // Converts text to uppercase for a bold look
    letterSpacing: 2, // Adds spacing between letters
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Shadow for depth
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset
    textShadowRadius: 3, // Shadow blur radius
  },

  table: {
    borderWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderColor: "white", // Border for the entire table
    marginBottom: 50,
    // borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "white",
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: "black",
    color: "black",
    marginBottom: 10,
  },
  headerText: {
    color: "black", // Header text color
    fontWeight: "bold",
    fontSize: 15,
  },
  row: {
    marginVertical: 2,
    borderBottomWidth: 1,
    borderColor: "white", // Underline for each row
  },
  cellText: {
    color: "white", // Text color for cells
    fontWeight: 900,
  },
});


function RankBoard({ data }: any) {
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#242439",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontWeight: 700,
          fontSize: 18,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        HYPER STANDINGS
      </Text>
      <View
        style={{
          width: 210,
          height: 120,
          flexDirection: "row",
          position: "relative",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            gap: 1,
            width: 70,
            position: "absolute",
            left: 0,
          }}
        >
          <View style={{ position: "relative" }}>
            <Image
              source={{
                uri: data[1]?.image ? `${BASE_URL}/quiz/${data[1]?.image}` : "",
              }}
              style={{
                height: 70,
                width: 70,
                borderRadius: 50,
                backgroundColor: "white",
                borderWidth: 1.5,
                borderColor: "#9D85FF",
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 30,
                height: 30,
                borderRadius: 50,
                backgroundColor: "#8BD379",
                bottom: -15,
                left: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 10 }}>2nd</Text>
            </View>
          </View>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              marginTop: 20,
              fontSize: 12,
            }}
          >
            {data[1]?.userName}
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: "#FF9921",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {data[1]?.combinedSortField.toFixed(1)}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            gap: 1,
            width: 90,
            position: "absolute",
            left: 60,
            zIndex: 5,
            top: -40,
          }}
        >
          <View style={{ position: "relative" }}>
            <Image
              source={{
                uri: data[0]?.image ? `${BASE_URL}/quiz/${data[0]?.image}` : "",
              }}
              style={{
                height: 90,
                width: 90,
                borderRadius: 50,
                backgroundColor: "white",
                borderWidth: 1.5,
                borderColor: "#9D85FF",
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 80,
                height: 80,
                borderRadius: 50,
                // backgroundColor: "#EEB64D",
                bottom: -40,
                left: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ position: "relative" }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    position: "absolute",
                    backgroundColor: "#EEB64D",
                    height: 30,
                    width: 30,
                    borderRadius: 50,
                    top: 25,
                    left: 25,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                    }}
                  >
                    1st
                  </Text>
                </View>

                <LottieView
                  source={require("../../assets/images/first.json")}
                  autoPlay
                  style={{ width: 80, height: 80 }}
                  loop
                />
              </View>
            </View>
          </View>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              marginTop: 25,
              fontSize: 12,
            }}
          >
            {data[0]?.userName}
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: "#FF9921",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {data[0]?.combinedSortField.toFixed(1)}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            gap: 1,
            width: 70,
            position: "absolute",
            left: 140,
          }}
        >
          <View style={{ position: "relative" }}>
            <Image
              source={{
                uri: data[2]?.image ? `${BASE_URL}/quiz/${data[2]?.image}` : "",
              }}
              style={{
                height: 70,
                width: 70,
                borderRadius: 50,
                backgroundColor: "white",
                borderWidth: 1.5,
                borderColor: "#9D85FF",
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 30,
                height: 30,
                borderRadius: 50,
                backgroundColor: "#B5A3FD",
                bottom: -15,
                left: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 10 }}>3rd</Text>
            </View>
          </View>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              marginTop: 20,
              fontSize: 12,
            }}
          >
            {data[2]?.userName}
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: "#FF9921",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {data[2]?.combinedSortField % 1 === 0
              ? data[2]?.combinedSortField.toFixed(0)
              : data[2]?.combinedSortField.toFixed(1)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function RankItem({ data, rank, active = false }: any) {
  return (
    <View
      style={{
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: active ? "transparent" : "#242439",
        flexDirection: "row",
        padding: 11,
        marginTop: 10,
        borderWidth: 1,
        borderColor: active ? "#7959FB" : "#242439",
        borderRadius: 15,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <Text style={{ color: "white" }}>{data.rank}</Text>
        <Image
          source={{
            uri: data?.image
              ? `${BASE_URL}/quiz/${data?.image}`
              : "https://static.vecteezy.com/system/resources/thumbnails/036/280/650/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
          }}
          style={{
            height: 40,
            width: 40,
            borderRadius: 50,
            backgroundColor: "white",
            borderWidth: 1.5,
            borderColor: "#9D85FF",
          }}
        />
        <Text style={{ color: "white", fontSize: 14 }}>{data.userName}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#BC9AF4",
          paddingHorizontal: 20,
          paddingVertical: 8,
        }}
      >
        <Text style={{ color: "white" }}>
          {" "}
          {data &&
            (data.combinedSortField % 1 === 0
              ? data.combinedSortField.toFixed(0)
              : data.combinedSortField.toFixed(1))}
        </Text>
      </View>
    </View>
  );
}