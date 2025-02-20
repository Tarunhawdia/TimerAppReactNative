import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatTime } from "../utils/time";
import ProgressBar from "./ProgressBar";

interface TimerProps {
  timer: {
    id: string;
    name: string;
    duration: number;
    remainingTime: number;
    isRunning: boolean;
    category: string;
  };
  refreshTimers: () => void;
}

export default function TimerItem({ timer, refreshTimers }: TimerProps) {
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime);
  const [isRunning, setIsRunning] = useState(timer.isRunning);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            markAsCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const saveTimers = async (updatedTimer: any) => {
    const storedTimers = await AsyncStorage.getItem("timers");
    if (storedTimers) {
      const timers = JSON.parse(storedTimers);
      const updatedTimers = timers.map((t: any) =>
        t.id === updatedTimer.id ? updatedTimer : t
      );
      await AsyncStorage.setItem("timers", JSON.stringify(updatedTimers));
      refreshTimers();
    }
  };

  const toggleStartPause = () => {
    setIsRunning(!isRunning);
    saveTimers({ ...timer, isRunning: !isRunning, remainingTime });
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingTime(timer.duration);
    saveTimers({ ...timer, isRunning: false, remainingTime: timer.duration });
  };

  const markAsCompleted = async () => {
    const storedHistory = await AsyncStorage.getItem("history");
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    history.push({ name: timer.name, completedAt: new Date().toISOString() });
    await AsyncStorage.setItem("history", JSON.stringify(history));

    const storedTimers = await AsyncStorage.getItem("timers");
    if (storedTimers) {
      const timers = JSON.parse(storedTimers).filter(
        (t: any) => t.id !== timer.id
      );
      await AsyncStorage.setItem("timers", JSON.stringify(timers));
      refreshTimers();
    }
  };

  // Calculate elapsed time for progress (duration - remaining)
  const elapsed = timer.duration - remainingTime;

  return (
    <View style={{ padding: 16, borderWidth: 1, marginBottom: 8 }}>
      <Text style={{ fontSize: 18 }}>{timer.name}</Text>
      <Text style={{ fontSize: 16, color: "gray" }}>
        {formatTime(remainingTime)}
      </Text>
      <ProgressBar current={elapsed} total={timer.duration} />
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <TouchableOpacity
          onPress={toggleStartPause}
          style={{ marginRight: 10 }}
        >
          <Text style={{ color: isRunning ? "red" : "green" }}>
            {isRunning ? "Pause" : "Start"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetTimer}>
          <Text style={{ color: "blue" }}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
