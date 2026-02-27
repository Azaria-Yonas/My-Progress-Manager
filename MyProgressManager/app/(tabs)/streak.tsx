// app/(tabs)/streak.tsx

import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Alert } from "react-native";
import { supabase } from "../../lib/supabaseClient";

import { useThemeMode } from "../../context/ThemeContext";
import StreaksHeader from "../../components/StreaksHeader";
import StreakAddModal from "../../components/StreakAddModal";
import StreakItem from "../../components/StreakItem";
import { createStreaksScreenStyles } from "../../styles/StreaksScreenStyles";
import BottomBar from "../../components/BottomBar";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  initHistory,
  recordTap,
  recordFail,
  exportCalendarData,
  StreakHistoryState,
} from "../../utils/streakHistory";

type DbStreak = {
  id: string;
  user_id: string;
  title: string;
  duration_seconds: number;
  cooldown_end: string | null;
  created_at: string;
  updated_at: string | null;
  streak_count: number;
  last_tap_at: string | null;
  paused?: boolean | null;
};

const StreaksScreen: React.FC = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { theme } = useThemeMode();
  const styles = createStreaksScreenStyles(theme);

  const [streaks, setStreaks] = useState<DbStreak[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const loadStreaks = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("streaks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at");

    if (error) {
      console.log("Load error:", error);
      return;
    }

    setStreaks((data || []) as DbStreak[]);
  };

  useEffect(() => {
    loadStreaks();
  }, []);



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
    }
    else if (now < cooldownEndUnix) {
      return;
    }
    else {
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

    const { error } = await supabase
      .from("streaks")
      .update({
        streak_count: newCount,
        cooldown_end: cooldownISO,
        last_tap_at: nowISO,
        updated_at: nowISO,
      })
      .eq("id", id);

    if (error) console.log("Update error:", error);

    loadStreaks();
  };



  const handleExpire = async (id: string) => {
    const nowISO = new Date().toISOString();

    const history = await loadHistoryFor(id);
    const updated = recordFail(history);
    await saveHistoryFor(id, updated);

    const { error } = await supabase
      .from("streaks")
      .update({
        streak_count: 0,
        cooldown_end: null,
        last_tap_at: null,
        updated_at: nowISO,
      })
      .eq("id", id);

    if (error) console.log("Expire error:", error);

    loadStreaks();
  };



  const handleTogglePause = async (id: string, paused: boolean) => {
    const nowISO = new Date().toISOString();

    const { error } = await supabase
      .from("streaks")
      .update({
        paused: !paused,
        updated_at: nowISO,
      })
      .eq("id", id);

    if (error) console.log("Pause error:", error);

    loadStreaks();
  };


  const handleComplete = async (streak: DbStreak) => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return;

    const nowISO = new Date().toISOString();

    const history = await loadHistoryFor(streak.id);
    const calendarData = exportCalendarData(history);

    const successCount = history.intervals.filter(
      (i) => i.status === "hit"
    ).length;
    const failCount = history.intervals.filter(
      (i) => i.status === "fail"
    ).length;

    const { error: insertError } = await supabase
      .from("completed_streaks")
      .insert({
        user_id: user.id,
        title: streak.title,
        streak_count: streak.streak_count,
        duration_seconds: streak.duration_seconds,
        created_at: streak.created_at,
        completed_at: nowISO,
        total_intervals: history.intervals.length,
        successful_intervals: successCount,
        failed_intervals: failCount,
        calendar_data: calendarData,
      });

    if (insertError) {
      console.log("Complete insert error:", insertError);
      return;
    }

    await clearHistoryFor(streak.id);

    const { error: deleteError } = await supabase
      .from("streaks")
      .delete()
      .eq("id", streak.id);

    if (deleteError) console.log("Complete delete error:", deleteError);

    loadStreaks();
  };

  const confirmComplete = (streak: DbStreak) => {
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
        contentContainerStyle={{ paddingTop: 150, paddingBottom: 120 }}
      >
        {streaks.map((s) => {
          const cooldownEndUnix = s.cooldown_end
            ? Math.floor(new Date(s.cooldown_end).getTime() / 1000)
            : null;

          const paused = !!s.paused;

          return (
            <View key={s.id} style={{ paddingHorizontal: 15 }}>
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

      <BottomBar />
    </View>
  );
};

export default StreaksScreen;
