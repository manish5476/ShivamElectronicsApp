import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { authService } from "../src/api/AuthService"; // update path if needed

export default function Index() {
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await authService.isAuthenticated(); // or your logic
      if (isAuthenticated) {
        router.replace("/customers");
      } else {
        router.replace("/auth/login");
      }
    };

    checkAuth();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}
