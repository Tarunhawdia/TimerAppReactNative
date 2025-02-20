import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationBar from "../../components/NavigatonBar";

interface HistoryItem {
  name: string;
  completedAt: string;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem("history");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem("history");
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const formattedDate = new Date(item.completedAt).toLocaleString();
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDate}>{formattedDate}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer History</Text>
      <NavigationBar />

      <FlatList
        data={history}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No history available.</Text>
        }
      />
      <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
        <Text style={styles.clearButtonText}>Clear History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  itemContainer: { padding: 10, borderBottomWidth: 1, borderColor: "#ccc" },
  itemName: { fontSize: 18 },
  itemDate: { fontSize: 14, color: "gray" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16 },
  clearButton: {
    backgroundColor: "red",
    padding: 12,
    marginTop: 16,
    borderRadius: 5,
    alignItems: "center",
  },
  clearButtonText: { color: "white", fontSize: 16 },
});
