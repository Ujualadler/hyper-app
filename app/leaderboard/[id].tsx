import { getRankList } from "@/Services/quizService";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        STANDINGS
      </Text>
      <Text
        variant="headlineSmall"
        style={{ color: "white", textAlign: "center", marginBottom: 15 }}
      >
        {formattedDate}
      </Text>

      <ScrollView>
        <DataTable style={styles.table}>
          <DataTable.Header style={styles.header}>
            <DataTable.Title>
              <Text style={styles.headerText}>Rank</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.headerText}>Name</Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text style={styles.headerText}>Points</Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text style={styles.headerText}>Time</Text>
            </DataTable.Title>
          </DataTable.Header>

          {rankData.map((item: any, index: number) => (
            <DataTable.Row
              key={index}
              style={{
                ...styles.row,
                backgroundColor: item.user === userId ? "black" : "",
              }}
            >
              <DataTable.Cell>
                <Text style={styles.cellText}>{item.rank}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text style={styles.cellText}>{item.userName}</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={styles.cellText}>
                  {item.combinedSortField.toFixed(1)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={styles.cellText}>
                  {(item.totalTime / 1000).toFixed(1)}s
                </Text>
              </DataTable.Cell>
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
    padding: 16,
    backgroundColor: "#027bad", // Background color for the page
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
    backgroundColor: "#de2939",
  },
  headerText: {
    color: "white", // Header text color
    fontWeight: "bold",
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
