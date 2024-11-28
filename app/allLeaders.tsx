import { getAllRank, getRankList } from "@/Services/quizService";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Text, DataTable } from "react-native-paper";

function Leaderboard() {
  const [rankData, setRankData] = useState<any>([]);
  const [userId, setUserId] = useState<string>('');

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
          setUserId(response.data.user)
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ display: "flex", flexDirection: "row",justifyContent:'center',alignItems:'center' }}>
        {/* <Image
          style={{ height: 100, width: 100 }}
          source={{
        uri:'https://img.freepik.com/free-vector/realistic-illustration-gold-cup-with-red-ribbon-winner-leader-champion_1262-13474.jpg?ga=GA1.1.563629714.1713778942&semt=ais_hybrid'
        }}
        /> */}
        <View >
          <Text variant="headlineLarge" style={styles.title}>
            HYPER
          </Text>
          <Text variant="headlineLarge" style={styles.title}>
            STANDINGS
          </Text>
          <Text
            variant="bodyLarge"
            style={{ color: "white", textAlign: "center", marginBottom: 15 }}
          >
            {formattedDate}
          </Text>
        </View>
      </View>

      <ScrollView style={{ position: "relative" }}>
        <DataTable style={styles.table}>
          <View style={styles.headerWrapper}>
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
                <Text style={styles.headerText}>TIME</Text>
              </DataTable.Title> */}
            </DataTable.Header>
            <View style={styles.headerPointy} /> {/* Pointy border */}
          </View>

          {rankData.map((item: any, index: number) => (
            <DataTable.Row key={index} style={{...styles.row,backgroundColor:item.user===userId?'black':''}}>
              <DataTable.Cell>
                <Text style={styles.cellText}>{item.rank}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={{ ...styles.cellText, color: "#de2939" }}>
                  {item.userName}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={styles.cellText}>{item.combinedSortField.toFixed(1)}</Text>
              </DataTable.Cell>
              {/* <DataTable.Cell numeric>
                <Text style={styles.cellText}>{(item.totalTime / 1000).toFixed(1)}s</Text>
              </DataTable.Cell> */}
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
}

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "SairaStencilOne",
    padding: 16,
    backgroundColor: "#28a0f6", // Background color for the page
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
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderColor: "white", // Border for the entire table
    marginBottom: 50,
    // borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#fff", // Sharpen left edge
    borderRadius: 50, // Sharpen right edge
    marginBottom: 10,
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
    color: "black", // Header text color
    fontWeight: "bold",
    fontFamily: "SairaStencilOne",
    fontSize: 15,
  },
  row: {
    borderBottomWidth: 1,
    borderColor: "white", // Underline for each row
  },
  cellText: {
    color: "white", // Text color for cells
    fontWeight: 900,
  },
});
