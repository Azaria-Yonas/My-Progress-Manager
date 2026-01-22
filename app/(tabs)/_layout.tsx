// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";

import { ThemeProvider, useThemeMode } from "../../context/ThemeContext";
import { TypographyProvider } from "../../context/TypographyContext";

function TabsThemed() {
  const { paperTheme } = useThemeMode();

  return (
    <PaperProvider theme={paperTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="loginSignup" />
      </Tabs>
    </PaperProvider>
  );
}

export default function TabsLayout() {
  return (
    <ThemeProvider>
      <TypographyProvider>
        <TabsThemed />
      </TypographyProvider>
    </ThemeProvider>
  );
}
