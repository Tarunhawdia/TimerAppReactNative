import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Timer {
  id: string;
  name: string;
  duration: number;
  category: string;
  remainingTime: number;
  isRunning: boolean;
}

interface BulkActionsProps {
  category: string;
  timers: Timer[];
  refreshTimers: () => void;
}

export default function BulkActions({
  category,
  timers,
  refreshTimers,
}: BulkActionsProps) {
  const updateTimers = async (updatedTimers: Timer[]) => {
    const storedTimers = await AsyncStorage.getItem("timers");
    if (storedTimers) {
      const allTimers: Timer[] = JSON.parse(storedTimers);
      const newTimers = allTimers.map((timer) => {
        if (timer.category === category) {
          const updated = updatedTimers.find((t) => t.id === timer.id);
          return updated ? updated : timer;
        }
        return timer;
      });
      await AsyncStorage.setItem("timers", JSON.stringify(newTimers));
      refreshTimers();
    }
  };

  const startAll = async () => {
    const updatedTimers = timers.map((timer) => ({
      ...timer,
      isRunning: true,
    }));
    await updateTimers(updatedTimers);
  };

  const pauseAll = async () => {
    const updatedTimers = timers.map((timer) => ({
      ...timer,
      isRunning: false,
    }));
    await updateTimers(updatedTimers);
  };

  const resetAll = async () => {
    const updatedTimers = timers.map((timer) => ({
      ...timer,
      isRunning: false,
      remainingTime: timer.duration,
    }));
    await updateTimers(updatedTimers);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={startAll}>
        <Text style={styles.buttonText}>Start All</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pauseAll}>
        <Text style={styles.buttonText}>Pause All</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={resetAll}>
        <Text style={styles.buttonText}>Reset All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  button: { backgroundColor: "#007BFF", padding: 8, borderRadius: 4 },
  buttonText: { color: "white" },
});
