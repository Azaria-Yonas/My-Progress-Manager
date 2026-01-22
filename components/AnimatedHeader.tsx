// MyProgressManager/components/AnimatedHeader.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";

interface AnimatedHeaderProps {
  scrollY: Animated.Value;
  onAddPress: () => void;
  styles: any; 
}

export default function AnimatedHeader({
  scrollY,
  onAddPress,
  styles,
}: AnimatedHeaderProps) {
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

  const addButtonOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
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
          Tasks
        </Animated.Text>


        <Animated.View style={{ opacity: addButtonOpacity }}>
          <TouchableOpacity style={styles.addCircleButton} onPress={onAddPress}>
            <Text style={styles.addButtonText}>＋</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>


      <Animated.Text
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 20,
          fontWeight: "600",
          opacity: smallTitleOpacity,
          color: styles.title.color, 
        }}
      >
        Tasks
      </Animated.Text>
    </Animated.View>
  );
}
