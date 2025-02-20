import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { v4 as uuidv4 } from "uuid";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/AppNavigator";
export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export default function AddTimerScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();

  const saveTimer = async () => {
    if (!name || !duration || !category) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const newTimer = {
      id: uuidv4(),
      name,
      duration: parseInt(duration) * 60, // Convert minutes to seconds
      category,
      remainingTime: parseInt(duration) * 60,
      isRunning: false,
    };

    const storedTimers = await AsyncStorage.getItem("timers");
    const timers = storedTimers ? JSON.parse(storedTimers) : [];
    timers.push(newTimer);

    await AsyncStorage.setItem("timers", JSON.stringify(timers));
    router.back();
  };

  const goBack = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Add New Timer
      </Text>

      <TextInput
        placeholder="Timer Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Duration (minutes)"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={goBack}
          style={{ backgroundColor: "blue", padding: 10 }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={saveTimer}
          style={{ backgroundColor: "blue", padding: 10 }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Add Timer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
