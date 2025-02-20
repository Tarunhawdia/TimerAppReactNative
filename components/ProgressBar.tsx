import React from "react";
import { View, StyleSheet } from "react-native";

interface ProgressBarProps {
  current: number; // elapsed seconds
  total: number; // total duration in seconds
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;
  return (
    <View style={styles.container}>
      <View style={[styles.filler, { width: `${percentage}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 10,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 4,
  },
  filler: {
    height: "100%",
    backgroundColor: "#3b5998",
  },
});
