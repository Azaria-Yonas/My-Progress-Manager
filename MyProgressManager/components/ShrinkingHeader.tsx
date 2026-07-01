import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

import { useThemeMode } from "../context/ThemeContext";
import { createHomeScreenStyles } from "../styles/HomeScreenStyles";
import { verticalScale, fontScale } from "../utils/responsive";

interface ShrinkingHeaderProps {
  scrollY: SharedValue<number>;
  onAddPress: () => void;
}

const ShrinkingHeader: React.FC<ShrinkingHeaderProps> = ({
  scrollY,
  onAddPress,
}) => {
  const { theme } = useThemeMode();

  const styles = createHomeScreenStyles(theme);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(scrollY.value, [0, 80], [verticalScale(120), verticalScale(70)], "clamp"),
    paddingVertical: interpolate(scrollY.value, [0, 80], [verticalScale(15), verticalScale(5)], "clamp"),
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(scrollY.value, [0, 80], [fontScale(58), fontScale(32)], "clamp"),
  }));

  return (
    <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
      <View style={styles.headerRow}>
        <Animated.Text style={[styles.title, titleAnimatedStyle]}>
          Tasks
        </Animated.Text>

        <TouchableOpacity
          style={styles.addCircleButton}
          onPress={onAddPress}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default ShrinkingHeader;
