import React from "react";
import { useRouter } from "expo-router";

const NavigationBar: React.FC = () => {
  const router = useRouter();

  const buttonStyle = {
    margin: "0 10px",
  };

  return (
    <nav>
      <button style={buttonStyle} onClick={() => router.push("/")}>
        Home
      </button>
      <button style={buttonStyle} onClick={() => router.push("/history")}>
        History
      </button>
    </nav>
  );
};

export default NavigationBar;
