import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

interface CategoryHeaderProps {
  category: string;
  expanded: boolean;
  onPress: () => void;
}

export default function CategoryHeader({category,expanded, onPress}: CategoryHeaderProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ padding: 10, backgroundColor: "#ddd" }}
    >
      <Text style={{ fontSize: 18 }}>
        {expanded ? "▼" : "▶"} {category}
      </Text>
    </TouchableOpacity>
  );
}
