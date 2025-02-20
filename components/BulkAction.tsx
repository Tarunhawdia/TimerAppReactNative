import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the Timer type
interface Timer {
  id: string;
  category: string;
  duration: number;
  remainingTime: number;
  isRunning: boolean;
  startTimestamp: number | null;
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
    await AsyncStorage.setItem("timers", JSON.stringify(updatedTimers));
    refreshTimers();
  };

  const startAllTimers = async () => {
    const updatedTimers = timers.map((timer) =>
      timer.category === category && !timer.isRunning
        ? { ...timer, isRunning: true, startTimestamp: Date.now() }
        : timer
    );
    updateTimers(updatedTimers);
  };

  const pauseAllTimers = async () => {
    const updatedTimers = timers.map((timer) =>
      timer.category === category && timer.isRunning
        ? {
            ...timer,
            isRunning: false,
            remainingTime: Math.max(
              timer.remainingTime -
                (Date.now() - (timer.startTimestamp || 0)) / 1000,
              0
            ),
            startTimestamp: null,
          }
        : timer
    );
    updateTimers(updatedTimers);
  };

  const resetAllTimers = async () => {
    const updatedTimers = timers.map((timer) =>
      timer.category === category
        ? {
            ...timer,
            isRunning: false,
            remainingTime: timer.duration,
            startTimestamp: null,
          }
        : timer
    );
    updateTimers(updatedTimers);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
      }}
    >
      <TouchableOpacity onPress={startAllTimers}>
        <Text style={{ color: "green" }}>Start All</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pauseAllTimers}>
        <Text style={{ color: "orange" }}>Pause All</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={resetAllTimers}>
        <Text style={{ color: "blue" }}>Reset All</Text>
      </TouchableOpacity>
    </View>
  );
}
