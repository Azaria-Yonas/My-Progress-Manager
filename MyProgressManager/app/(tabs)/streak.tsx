// app/(tabs)/streak.tsx

import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Alert } from "react-native";

import { useThemeMode } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthProvider";
import StreaksHeader from "../../components/StreaksHeader";
import StreakAddModal from "../../components/StreakAddModal";
import StreakItem from "../../components/StreakItem";
import { createStreaksScreenStyles } from "../../styles/StreaksScreenStyles";
import BottomBar from "../../components/BottomBar";
import AgentChat from "../../components/AgentChat";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  initHistory,
  recordTap,
  recordFail,
  exportCalendarData,
  StreakHistoryState,
} from "../../utils/streakHistory";

import { ApiStreak, StreaksService } from "../../services/streaks";
import { useNotify } from "../../hooks/use-notify";
import { scale, verticalScale } from "../../utils/responsive";

const StreaksScreen: React.FC = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { theme } = useThemeMode();
  const { user, initializing } = useAuth();
  const styles = createStreaksScreenStyles(theme);

  const [streaks, setStreaks] = useState<ApiStreak[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const loadStreaks = async () => {
    if (!user) return;
    try {
      const data = await StreaksService.list();
      setStreaks(data ?? []);
    } catch (err) {
      console.log("Load error:", err);
    }
  };

  useEffect(() => {
    if (!initializing && user) loadStreaks();
  }, [user, initializing]);

  useNotify(["streaks", "completed_streaks"], loadStreaks);


  async function loadHistoryFor(id: string): Promise<StreakHistoryState> {
    const key = `streak_history_${id}`;
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return initHistory();
    try {
      return JSON.parse(raw);
    } catch {
      return initHistory();
    }
  }

  async function saveHistoryFor(id: string, history: StreakHistoryState) {
    const key = `streak_history_${id}`;
    await AsyncStorage.setItem(key, JSON.stringify(history));
  }

  async function clearHistoryFor(id: string) {
    await AsyncStorage.removeItem(`streak_history_${id}`);
  }


  const handlePress = async (id: string) => {
    const now = Math.floor(Date.now() / 1000);
    const nowISO = new Date(now * 1000).toISOString();

    const s = streaks.find((x) => x.id === id);
    if (!s) return;

    if (s.paused) return;

    let history = await loadHistoryFor(id);

    const cooldownEndUnix = s.cooldown_end
      ? Math.floor(new Date(s.cooldown_end).getTime() / 1000)
      : null;

    const D = s.duration_seconds;

    let newCount = s.streak_count;
    let newCooldownEndUnix: number | null = null;

    if (!cooldownEndUnix || now >= cooldownEndUnix + D) {
      history = recordTap(history, now, D);
      newCount += 1;
      newCooldownEndUnix = now + D;
    } else if (now < cooldownEndUnix) {
      return;
    } else {
      history = recordTap(history, now, D);

      const elapsed = now - cooldownEndUnix;
      const remaining = D - elapsed;

      if (remaining <= 0) return;

      newCount += 1;
      newCooldownEndUnix = now + remaining;
    }

    await saveHistoryFor(id, history);

    const cooldownISO = newCooldownEndUnix
      ? new Date(newCooldownEndUnix * 1000).toISOString()
      : null;

    try {
      await StreaksService.update(id, {
        streak_count: newCount,
        cooldown_end: cooldownISO,
        last_tap_at: nowISO,
      });
    } catch (err) {
      console.log("Update error:", err);
    }

    loadStreaks();
  };


  const handleExpire = async (id: string) => {
    const history = await loadHistoryFor(id);
    const updated = recordFail(history);
    await saveHistoryFor(id, updated);

    try {
      await StreaksService.update(id, {
        streak_count: 0,
        cooldown_end: null,
        last_tap_at: null,
      });
    } catch (err) {
      console.log("Expire error:", err);
    }

    loadStreaks();
  };


  const handleTogglePause = async (id: string, paused: boolean) => {
    try {
      await StreaksService.pause(id, !paused);
    } catch (err) {
      console.log("Pause error:", err);
    }
    loadStreaks();
  };


  const handleComplete = async (streak: ApiStreak) => {
    if (!user) return;

    const history = await loadHistoryFor(streak.id);
    const calendarData = exportCalendarData(history);

    const successCount = history.intervals.filter(
      (i) => i.status === "hit"
    ).length;
    const failCount = history.intervals.filter(
      (i) => i.status === "fail"
    ).length;

    try {
      await StreaksService.complete(streak.id, {
        total_intervals: history.intervals.length,
        successful_intervals: successCount,
        failed_intervals: failCount,
        calendar_data: calendarData,
      });
    } catch (err) {
      console.log("Complete error:", err);
      return;
    }

    await clearHistoryFor(streak.id);
    loadStreaks();
  };

  const confirmComplete = (streak: ApiStreak) => {
    Alert.alert(
      "Complete streak?",
      `This will move "${streak.title}" to your Stats page.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Complete", style: "destructive", onPress: () => handleComplete(streak) },
      ]
    );
  };


  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StreaksHeader
        scrollY={scrollY}
        onAddPress={() => setModalVisible(true)}
        styles={styles}
      />

      <StreakAddModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={loadStreaks}
      />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingTop: verticalScale(150), paddingBottom: verticalScale(120) }}
      >
        {streaks.map((s) => {
          const cooldownEndUnix = s.cooldown_end
            ? Math.floor(new Date(s.cooldown_end).getTime() / 1000)
            : null;

          const paused = !!s.paused;

          return (
            <View key={s.id} style={{ paddingHorizontal: scale(16) }}>
              <StreakItem
                title={s.title}
                streakCount={s.streak_count}
                cooldownEndUnix={cooldownEndUnix}
                durationSeconds={s.duration_seconds}
                paused={paused}
                onPress={() => handlePress(s.id)}
                onComplete={() => confirmComplete(s)}
                onTogglePause={() => handleTogglePause(s.id, paused)}
                onExpire={() => handleExpire(s.id)}
              />
            </View>
          );
        })}
      </Animated.ScrollView>

      <AgentChat scrollY={scrollY} />

      <BottomBar />
    </View>
  );
};

export default StreaksScreen;
