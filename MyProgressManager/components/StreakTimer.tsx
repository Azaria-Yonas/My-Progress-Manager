// MyProgressManager/components/StreakTimer.tsx

import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

type Phase = "ready" | "cooldown" | "expiration" | "paused";

type Props = {
  cooldownEndUnix: number | null;
  duration: number; 
  styles: any; 
  paused?: boolean;
  onExpire?: () => void; 
  onPhaseChange?: (phase: Phase) => void;
};

const StreakTimer: React.FC<Props> = ({
  cooldownEndUnix,
  duration,
  styles,
  paused = false,
  onExpire,
  onPhaseChange,
}) => {
  const [phase, setPhase] = useState<Phase>("ready");
  const [seconds, setSeconds] = useState(0);

  const lastExpiredCooldownRef = useRef<number | null>(null);

  useEffect(() => {
    lastExpiredCooldownRef.current = null;
  }, [cooldownEndUnix, duration]);

  useEffect(() => {
 
    if (paused) {
      setPhase("paused");
      if (onPhaseChange) onPhaseChange("paused");
      return;
    }

    const tick = () => {
      const now = Math.floor(Date.now() / 1000);

      if (!cooldownEndUnix) {
        setPhase("ready");
        setSeconds(0);
        if (onPhaseChange) onPhaseChange("ready");
        return;
      }

      const expirationEnd = cooldownEndUnix + duration;

      if (now < cooldownEndUnix) {
        setPhase("cooldown");
        setSeconds(cooldownEndUnix - now); 
        if (onPhaseChange) onPhaseChange("cooldown");
        return;
      }

      if (now < expirationEnd) {
        setPhase("expiration");
        setSeconds(expirationEnd - now); 
        if (onPhaseChange) onPhaseChange("expiration");
        return;
      }

      setPhase("ready");
      setSeconds(0);
      if (onPhaseChange) onPhaseChange("ready");

      if (
        onExpire &&
        cooldownEndUnix &&
        lastExpiredCooldownRef.current !== cooldownEndUnix
      ) {
        lastExpiredCooldownRef.current = cooldownEndUnix;
        onExpire();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [paused, cooldownEndUnix, duration, onExpire, onPhaseChange]);

  const formatHMS = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  const timerText = formatHMS(Math.max(0, seconds));

  if (phase === "paused") {
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={styles.pausedText || styles.readyText}>Paused</Text>
        <Text style={styles.timer}>{timerText}</Text>
      </View>
    );
  }

  if (phase === "ready") {
    return <Text style={styles.readyText}>Ready to Begin</Text>;
  }

  return <Text style={styles.timer}>{timerText}</Text>;
};

export default StreakTimer;
