// MyProgressManager/components/StreakItem.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "../context/ThemeContext";
import { useTypography } from "../context/TypographyContext";
import { createStreakItemStyles } from "../styles/StreakItemStyles";

import StreakTimer from "./StreakTimer";

type Phase = "ready" | "cooldown" | "expiration" | "paused";

interface Props {
  title: string;
  streakCount: number;
  cooldownEndUnix: number | null;
  durationSeconds: number;
  paused: boolean;
  onPress: () => void;
  onComplete: () => void;
  onTogglePause: () => void;
  onExpire: () => void;
}

export default function StreakItem({
  title,
  streakCount,
  cooldownEndUnix,
  durationSeconds,
  paused,
  onPress,
  onComplete,
  onTogglePause,
  onExpire,
}: Props) {
  const { theme } = useThemeMode();
  const { fontSize, fontWeight } = useTypography();

  const styles = createStreakItemStyles(theme, fontSize, fontWeight);

  const [phase, setPhase] = useState<Phase>("ready");

  const isCoolingDown = phase === "cooldown";
  const isDisabled = paused || isCoolingDown;

  let buttonLabel = "Increase Streak";
  if (paused) buttonLabel = "Paused";
  else if (isCoolingDown) buttonLabel = "On Cooldown";

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={onComplete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name="checkmark-done-outline"
          size={22}
          color={theme.text}
        />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.streakCount}>🔥 {streakCount}</Text>

      <StreakTimer
        cooldownEndUnix={cooldownEndUnix}
        duration={durationSeconds}
        styles={styles}
        paused={paused}
        onExpire={onExpire}
        onPhaseChange={(p) => setPhase(p)}
      />

      <View style={{ marginTop: 12 }}>
        <TouchableOpacity
          onPress={onPress}
          disabled={isDisabled}
          style={[
            styles.button,
            {
              backgroundColor: isDisabled ? theme.card : theme.primary,
              opacity: isDisabled ? 0.6 : 1,
            },
          ]}
        >
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onTogglePause}
          style={[
            styles.button,
            {
              marginTop: 8,
              backgroundColor: theme.card,
              opacity: 0.9,
            },
          ]}
        >
          <Text style={styles.buttonText}>
            {paused ? "Resume" : "Pause"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
