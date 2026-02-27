// components/ReusableAnimatedHeader.tsx
import React from "react";
import { View, Text, Animated, Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

interface ReusableAnimatedHeaderProps {
  scrollY: Animated.Value;
  title: string;
  styles: any; 
}

export default function ReusableAnimatedHeader({
  scrollY,
  title,
  styles,
}: ReusableAnimatedHeaderProps) {
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [130, 70],
    extrapolate: "clamp",
  });

  const titleSize = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [58, 20],
    extrapolate: "clamp",
  });

  const bigTitleOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const smallTitleOpacity = scrollY.interpolate({
    inputRange: [20, 80],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const blurIntensity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [0, 35],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        { height: headerHeight },
      ]}
    >
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          opacity:
            Platform.OS === "ios"
              ? blurIntensity.interpolate({
                  inputRange: [0, 35],
                  outputRange: [0, 1],
                })
              : 0,
        }}
      >
        <BlurView intensity={35} tint="light" style={{ flex: 1 }} />
      </Animated.View>

      <View style={styles.headerRow}>
        <Animated.Text
          style={[
            styles.title,
            {
              fontSize: titleSize,
              opacity: bigTitleOpacity,
            },
          ]}
        >
          {title}
        </Animated.Text>
      </View>

      <Animated.Text
        style={[
          styles.smallTitle,
          { opacity: smallTitleOpacity },
        ]}
      >
        {title}
      </Animated.Text>
    </Animated.View>
  );
}
