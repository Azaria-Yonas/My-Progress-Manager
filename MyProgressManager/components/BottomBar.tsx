import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeMode } from "../context/ThemeContext";
import { useRouter, useSegments } from "expo-router";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { scale, verticalScale } from "../utils/responsive";

type IconName = keyof typeof Feather.glyphMap;

const tabs: { route: string; iconName: IconName }[] = [
  { route: "home", iconName: "menu" },
  { route: "streak", iconName: "zap" },
  { route: "stats", iconName: "bar-chart-2" },
  { route: "profile", iconName: "user" },
];

export default function BottomBar() {
  const { theme } = useThemeMode();
  const router = useRouter();
  const segments = useSegments();

  const current = segments[segments.length - 1];
  const styles = createStyles(theme);

  return (
    <View style={styles.wrapper}>
      {tabs.map(({ route, iconName }) => {
        const isActive = current === route;

        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [
              {
                scale: withSpring(isActive ? 1.2 : 1, {
                  damping: 15,
                  stiffness: 150,
                }),
              },
            ],
          };
        });

        return (
          <TouchableOpacity
            key={route}
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => router.push(`/(tabs)/${route}` as any)}
          >
            <Animated.View style={animatedStyle}>
              <Feather
                name={iconName}
                size={scale(26)}
                color={isActive ? theme.onPrimary : theme.onPrimary + "B0"}
              />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    wrapper: {
      position: "absolute",
      bottom: verticalScale(30),
      width: "90%",
      alignSelf: "center",

      backgroundColor: theme.primary,
      borderRadius: scale(28),
      paddingVertical: verticalScale(12),

      shadowColor: theme.primary,
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: verticalScale(6) },
      shadowRadius: scale(12),
      elevation: 10,

      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",

      zIndex: 999,
    },

    tab: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
