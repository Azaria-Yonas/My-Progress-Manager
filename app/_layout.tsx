// app/_layout.tsx
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";

import { LoadingProvider, useLoading } from "../context/LoadingContext";
import LoadingOverlay from "../components/LoadingOverlay";
import { AuthProvider } from "../context/AuthProvider";  

function LayoutInner() {
  const { isLoading } = useLoading();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {isLoading && <LoadingOverlay />}
    </>
  );
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    RobotoThin: require("../assets/fonts/Roboto-Thin.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>                    
          <LoadingProvider>
            <LayoutInner />
          </LoadingProvider>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
