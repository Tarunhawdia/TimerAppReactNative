import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatTime } from "../utils/time";
import ProgressBar from "./ProgressBar";

export interface Timer {
  id: string;
  name: string;
  duration: number; // total duration in seconds
  remainingTime: number; // remaining time (when paused) in seconds
  isRunning: boolean;
  category: string;
  startTimestamp?: number | null; // timestamp (ms) when timer started
}

interface TimerItemProps {
  timer: Timer;
  refreshTimers: () => void;
}

export default function TimerItem({ timer, refreshTimers }: TimerItemProps) {
  // currentRemaining will be computed based on the startTimestamp if running
  const [currentRemaining, setCurrentRemaining] = useState(timer.remainingTime);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer.isRunning && timer.startTimestamp) {
      // Function to update the remaining time based on the elapsed time
      const updateRemaining = () => {
        const elapsed = (Date.now() - timer.startTimestamp!) / 1000;
        const newRemaining = Math.max(timer.remainingTime - elapsed, 0);
        setCurrentRemaining(newRemaining);
        if (newRemaining <= 0) {
          if (interval) clearInterval(interval);
          markAsCompleted();
        }
      };
      updateRemaining();
      interval = setInterval(updateRemaining, 1000);
    } else {
      setCurrentRemaining(timer.remainingTime);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Save updated timer to AsyncStorage
  const saveTimer = async (updatedTimer: Timer) => {
    const storedTimers = await AsyncStorage.getItem("timers");
    if (storedTimers) {
      const timers: Timer[] = JSON.parse(storedTimers);
      const updatedTimers = timers.map((t) =>
        t.id === updatedTimer.id ? updatedTimer : t
      );
      await AsyncStorage.setItem("timers", JSON.stringify(updatedTimers));
      refreshTimers();
    }
  };

  // Toggle between starting and pausing the timer
  const toggleStartPause = () => {
    if (timer.isRunning) {
      // Pause: compute elapsed time and update remainingTime
      const elapsed = (Date.now() - (timer.startTimestamp || 0)) / 1000;
      const updatedRemaining = Math.max(timer.remainingTime - elapsed, 0);
      const updatedTimer: Timer = {
        ...timer,
        isRunning: false,
        remainingTime: updatedRemaining,
        startTimestamp: null,
      };
      saveTimer(updatedTimer);
    } else {
      // Start: record the current time as startTimestamp
      const updatedTimer: Timer = {
        ...timer,
        isRunning: true,
        startTimestamp: Date.now(),
      };
      saveTimer(updatedTimer);
    }
  };

  // Reset the timer to its original duration
  const resetTimer = () => {
    const updatedTimer: Timer = {
      ...timer,
      isRunning: false,
      remainingTime: timer.duration,
      startTimestamp: null,
    };
    setCurrentRemaining(timer.duration);
    saveTimer(updatedTimer);
  };

  // When the timer reaches 0, mark it as completed and log it to history
  const markAsCompleted = async () => {
    const storedHistory = await AsyncStorage.getItem("history");
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    history.push({ name: timer.name, completedAt: new Date().toISOString() });
    await AsyncStorage.setItem("history", JSON.stringify(history));

    // Mark the timer as completed
    const updatedTimer: Timer = {
      ...timer,
      isRunning: false,
      remainingTime: 0,
      startTimestamp: null,
    };
    await saveTimer(updatedTimer);
    resetTimer();
  };

  // Calculate elapsed seconds for the progress bar
  const elapsed = timer.duration - currentRemaining;

  return (
    <View style={{ padding: 16, borderWidth: 1, marginBottom: 8 }}>
      <Text style={{ fontSize: 18 }}>{timer.name}</Text>
      <Text style={{ fontSize: 16, color: "gray" }}>
        {formatTime(Math.floor(currentRemaining))}
      </Text>
      <ProgressBar current={elapsed} total={timer.duration} />
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <TouchableOpacity
          onPress={toggleStartPause}
          style={{ marginRight: 10 }}
        >
          <Text style={{ color: timer.isRunning ? "red" : "green" }}>
            {timer.isRunning ? "Pause" : "Start"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetTimer}>
          <Text style={{ color: "blue" }}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
