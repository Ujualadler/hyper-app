import ParallaxScrollView from "@/components/ParallaxScrollView";
import { BASE_URL } from "@/constants/config";
import { getAllRank, getRankList } from "@/Services/quizService";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Text, DataTable } from "react-native-paper";

function OverallRank() {
  const [rankData, setRankData] = useState<any>([]);
  const [userId, setUserId] = useState<string>("");

  const today = new Date();

  // Format the date
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options as any);

  useEffect(() => {
    (async () => {
      try {
        const response = await getAllRank();
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
      headerHeight={280}
      background="#1A1A24"
      headerImage={
        <RankBoard
          data={
            rankData.length > 0 &&
            rankData.filter(
              (item: any) =>
                item.rank == 1 || item.rank === 2 || item.rank === 3
            )
          }
        />
      }
    >
      <View style={styles.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Image
          style={{ height: 100, width: 100 }}
          source={{
        uri:'https://img.freepik.com/free-vector/realistic-illustration-gold-cup-with-red-ribbon-winner-leader-champion_1262-13474.jpg?ga=GA1.1.563629714.1713778942&semt=ais_hybrid'
        }}
        /> */}
          {/* <View>
            <Text variant="headlineSmall" style={styles.title}>
              HYPER
            </Text>
            <Text variant="headlineSmall" style={styles.title}>
              STANDINGS
            </Text>
            <Text
              variant="bodyLarge"
              style={{ color: "white", textAlign: "center", marginBottom: 15 }}
            >
              {formattedDate}
            </Text>
          </View> */}
        </View>

        {/* <ScrollView style={{ position: "relative" }}> */}
        <DataTable style={styles.table}>
          {rankData.length > 0 ? (
            rankData.map((item: any, index: number) =>
              item.rank === 1 || item.rank === 2 || item.rank === 3 ? (
                ""
              ) : item.user === userId ? (
                <RankItem data={item} rank={index + 1} active={true} />
              ) : (
                <RankItem data={item} rank={index + 1} active={false} />
              )
            )
          ) : (
            <DataTable.Row
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              {/* <DataTable.Cell > */}
              <Text style={{ textAlign: "center", color: "white" }}>
                Waiting for the First Brave Soul
              </Text>
              {/* </DataTable.Cell> */}
            </DataTable.Row>
          )}
        </DataTable>
        {/* </ScrollView> */}
      </View>
    </ParallaxScrollView>
  );
}

export default OverallRank;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "SairaStencilOne",
    padding: 16,
    backgroundColor: "#1A1A24", // Background color for the page
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
    fontFamily: "SairaStencilOne",
    fontWeight: "bold",
    color: "#ffe600", // Gold color for a standout effect
    textTransform: "uppercase", // Converts text to uppercase for a bold look
    letterSpacing: 2, // Adds spacing between letters
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Shadow for depth
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset
    textShadowRadius: 3, // Shadow blur radius
  },

  table: {
    // borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderColor: "white", // Border for the entire table
    marginBottom: 50,
    // borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#ffe600", // Sharpen left edge
    borderRadius: 10, // Sharpen right edge
    marginBottom: 10,
    // borderWidth: 1,
    // borderColor: "black",
  },
  headerWrapper: {
    // position: "relative", // Needed to position the pointy border relative to the header
  },
  headerPointy: {
    position: "absolute",
    top: 0, // Moves the point above the header
    left: 0,
    zIndex: -5,
    height: 50,
    width: 50,
    // backgroundColor: "black",
    // Matches the header background color
    transform: [{ rotate: "45deg" }],
  },
  headerText: {
    color: "#28a0f6", // Header text color
    fontWeight: "bold",
    fontFamily: "SairaStencilOne",
    fontSize: 15,
  },
  row: {
    borderBottomWidth: 1,
    marginVertical: 2,
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
