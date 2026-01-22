import React, { useEffect } from "react";
import { Image, ImageSourcePropType, StyleProp, ImageStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";

interface SpinningLogoProps {
  source: ImageSourcePropType;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export default function SpinningLogo({ source, size = 150, style }: SpinningLogoProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(1080, { 
      duration: 1000, 
      easing: Easing.out(Easing.exp), 
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value % 360}deg`, 
      },
    ],
  }));

  return (
    <Animated.Image
      source={source}
      style={[{ width: size, height: size }, animatedStyle, style]}
      resizeMode="contain"
    />
  );
}
