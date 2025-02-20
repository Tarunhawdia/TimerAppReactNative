import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimerItem from "../../components/TimerItem";
import CategoryHeader from "../../components/CategoryHeader";
import NavigationBar from "../../components/NavigatonBar";

interface Timer {
  id: string;
  name: string;
  duration: number;
  category: string;
  remainingTime: number;
  isRunning: boolean;
}

export default function HomeScreen() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const router = useRouter();

  useEffect(() => {
    loadTimers();
  }, []);

  const loadTimers = async () => {
    const storedTimers = await AsyncStorage.getItem("timers");
    if (storedTimers) {
      setTimers(JSON.parse(storedTimers));
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const groupedTimers = timers.reduce((acc, timer) => {
    if (!acc[timer.category]) acc[timer.category] = [];
    acc[timer.category].push(timer);
    return acc;
  }, {} as Record<string, Timer[]>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timers</Text>
      <NavigationBar />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/add-timer")}
        >
          <Text style={styles.buttonText}>+ Add Timer</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={Object.keys(groupedTimers)}
        keyExtractor={(item) => item}
        renderItem={({ item: category }) => (
          <View>
            <CategoryHeader
              category={category}
              expanded={!!expandedCategories[category]}
              onPress={() => toggleCategory(category)}
            />
            {expandedCategories[category] && (
              <>
                {groupedTimers[category].map((timer) => (
                  <TimerItem
                    key={timer.id}
                    timer={timer}
                    refreshTimers={loadTimers}
                  />
                ))}
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { color: "white", fontSize: 16 },
});
