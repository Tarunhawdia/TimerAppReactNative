import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../components/AppNavigator";
export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

const NavigationBar: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const buttonStyle = {
    margin: "0 10px",
  };

  return (
    <nav>
      <button style={buttonStyle} onClick={() => navigation.navigate("Home")}>
        Home
      </button>
      <button
        style={buttonStyle}
        onClick={() => navigation.navigate("History")}
      >
        History
      </button>
    </nav>
  );
};

export default NavigationBar;
