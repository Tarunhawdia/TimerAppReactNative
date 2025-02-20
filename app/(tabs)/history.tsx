import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    const storedHistory = await AsyncStorage.getItem("history");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  };

  const clearHistory = async () => {
    await AsyncStorage.removeItem("history");
    setHistory([]);
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
      <FlatList
        data={history}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No history available.</Text>
        }
      />
      <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
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
