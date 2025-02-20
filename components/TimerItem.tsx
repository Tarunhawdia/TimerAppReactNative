import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatTime } from "../utils/time";
import ProgressBar from "./ProgressBar";
import BulkActions from "./BulkAction";

export interface Timer {
  id: string;
  name: string;
  duration: number;
  remainingTime: number;
  isRunning: boolean;
  category: string;
  startTimestamp: number | null;
}

interface TimerItemProps {
  timer: Timer;
  timers: Timer[];
  refreshTimers: () => void;
}

export default function TimerItem({
  timer,
  timers,
  refreshTimers,
}: TimerItemProps) {
  const [currentRemaining, setCurrentRemaining] = useState(timer.remainingTime);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer.isRunning && timer.startTimestamp) {
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

  const deleteTimer = async () => {
    const storedTimers = await AsyncStorage.getItem("timers");
    if (storedTimers) {
      const timers: Timer[] = JSON.parse(storedTimers);
      const updatedTimers = timers.filter((t) => t.id !== timer.id);
      await AsyncStorage.setItem("timers", JSON.stringify(updatedTimers));
      refreshTimers();
    }
  };

  const toggleStartPause = () => {
    if (timer.isRunning) {
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
      const updatedTimer: Timer = {
        ...timer,
        isRunning: true,
        startTimestamp: Date.now(),
      };
      saveTimer(updatedTimer);
    }
  };

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

  const markAsCompleted = async () => {
    const storedHistory = await AsyncStorage.getItem("history");
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    history.push({ name: timer.name, completedAt: new Date().toISOString() });
    await AsyncStorage.setItem("history", JSON.stringify(history));

    const updatedTimer: Timer = {
      ...timer,
      isRunning: false,
      remainingTime: 0,
      startTimestamp: null,
    };
    await saveTimer(updatedTimer);
  };

  const elapsed = timer.duration - currentRemaining;

  return (
    <View style={{ padding: 16, borderWidth: 1, marginBottom: 8 }}>
      <BulkActions
        category={timer.category}
        timers={timers}
        refreshTimers={refreshTimers}
      />
      <Text style={{ fontSize: 18 }}>{timer.name}</Text>
      <Text style={{ fontSize: 16, color: "black" }}>
        {currentRemaining > 0
          ? formatTime(Math.floor(currentRemaining))
          : "Completed"}
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
        <TouchableOpacity onPress={resetTimer} style={{ marginRight: 10 }}>
          <Text style={{ color: "blue" }}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteTimer}>
          <Text style={{ color: "red" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
