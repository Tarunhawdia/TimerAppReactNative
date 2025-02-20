import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Timer {
  id: string;
  duration: number;
  remainingTime: number;
  isRunning: boolean;
}

interface BulkActionsProps {
  category: string;
  timers: Timer[];
  refreshTimers: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  category,
  timers,
  refreshTimers,
}) => {
  const updateTimers = async (updatedTimers: Timer[]) => {
    await AsyncStorage.setItem("timers", JSON.stringify(updatedTimers));
    refreshTimers(); // Refresh UI
  };

  const startAllTimers = async () => {
    const updatedTimers = timers.map((timer) => ({
      ...timer,
      isRunning: true,
    }));
    await updateTimers(updatedTimers);
  };

  const pauseAllTimers = async () => {
    const updatedTimers = timers.map((timer) => ({
      ...timer,
      isRunning: false,
    }));
    await updateTimers(updatedTimers);
  };

  const resetAllTimers = async () => {
    const updatedTimers = timers.map((timer) => ({
      ...timer,
      remainingTime: timer.duration, // Reset time
      isRunning: false,
    }));
    await updateTimers(updatedTimers);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={startAllTimers}>
        <Text style={styles.buttonText}>Start All</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pauseAllTimers}>
        <Text style={styles.buttonText}>Pause All</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={resetAllTimers}>
        <Text style={styles.buttonText}>Reset All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: { backgroundColor: "gray", padding: 8, borderRadius: 5 },
  buttonText: { color: "white", fontSize: 14 },
});

export default BulkActions;
