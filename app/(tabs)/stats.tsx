// app/(tabs)/stats.tsx

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  ScrollView,
} from "react-native";

import { supabase } from "../../lib/supabaseClient";
import { useThemeMode } from "../../context/ThemeContext";
import { useTypography } from "../../context/TypographyContext";

import ReusableAnimatedHeader from "../../components/ReusableAnimatedHeader";
import TaskAnalyticsCard from "../../components/TaskAnalyticsCard";
import { createReusableHeaderStyles } from "../../styles/ReusableHeaderStyles";
import { createStatsStyles } from "../../styles/StatsStyles";
import BottomBar from "../../components/BottomBar";

import type { User } from "@supabase/supabase-js";


interface CalendarDataEntry {
  status: string;
  index: number;
}
type CalendarData = Record<string, CalendarDataEntry>;

interface IntervalEntry {
  key: string;
  status: string;
  index: number;
}

interface CompletedTask {
  id: string;
  user_id: string;
  title: string;
  color: string | null;
  due_date: string | null;
  completed_at: string;
}

interface CompletedStreak {
  id: string;
  user_id: string;
  title: string;
  streak_count: number;
  duration_seconds: number;
  created_at: string;
  completed_at: string;
  total_intervals: number;
  successful_intervals: number;
  failed_intervals: number;
  calendar_data: CalendarData | null;
}


function getLongestStreak(calendarData: CalendarData | null): number {
  if (!calendarData) return 0;

  const entries = Object.values(calendarData).sort(
    (a, b) => a.index - b.index
  );

  let longest = 0;
  let current = 0;

  for (const entry of entries as CalendarDataEntry[]) {
    if (entry.status === "hit") {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

const normalizeCalendarData = (
  calendarData: CalendarData | null
): IntervalEntry[] => {
  if (!calendarData) return [];

  const out: IntervalEntry[] = [];

  for (const [key, val] of Object.entries(calendarData)) {
    out.push({
      key,
      status: val.status,
      index: val.index,
    });
  }

  return out.sort((a, b) => a.index - b.index);
};

function getRowCount(intervals: IntervalEntry[]): number {
  return Math.ceil(intervals.length / 7); 
}


const StatsScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [completedStreaks, setCompletedStreaks] = useState<CompletedStreak[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const scrollY = useRef(new Animated.Value(0)).current;

  const { theme } = useThemeMode();
  const { fontSize, fontWeight } = useTypography();

  const headerStyles = createReusableHeaderStyles(theme);
  const styles = createStatsStyles(theme);


  useEffect(() => {
    const loadEverything = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      const [streakRes, taskRes] = await Promise.all([
        supabase
          .from("completed_streaks")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("completed_at", { ascending: false }),

        supabase
          .from("completed_tasks")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("completed_at", { ascending: false }),
      ]);

      if (!streakRes.error && streakRes.data) {
        setCompletedStreaks(streakRes.data as CompletedStreak[]);
      }

      if (!taskRes.error && taskRes.data) {
        setCompletedTasks(taskRes.data as CompletedTask[]);
      }

      setLoading(false);
    };

    loadEverything();
  }, []);

  if (!user || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }


  const glass = {
    backgroundColor: theme.primary + "20",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.primary + "40",
    backdropFilter: "blur(20px)",
    shadowColor: theme.primary,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 20,
  };


  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ReusableAnimatedHeader
        scrollY={scrollY}
        title="Stats"
        styles={headerStyles}
      />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={styles.scrollContent}
      >
        <TaskAnalyticsCard tasks={completedTasks} />


        <View style={styles.card}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: fontSize(22),
                fontWeight: fontWeight(),
                color: theme.text,
                marginBottom: 10,
              },
            ]}
          >
            Streak Report
          </Text>

          <View style={{ maxHeight: 650 }}>
            <ScrollView>
              {completedStreaks.length === 0 && (
                <Text style={[styles.emptyTextSmall, { marginTop: 10 }]}>
                  No completed streaks yet.
                </Text>
              )}

              {completedStreaks.map((streak) => {
                const intervals = normalizeCalendarData(streak.calendar_data);
                const rowCount = getRowCount(intervals);
                const isExpanded = expanded[streak.id] === true;
                const longest = getLongestStreak(streak.calendar_data);

                const visibleIntervals = isExpanded
                  ? intervals
                  : intervals.slice(0, 14); 

                return (
                  <View key={streak.id} style={glass}>
                    <Text
                      style={{
                        fontSize: fontSize(19),
                        fontWeight: fontWeight(),
                        color: theme.text,
                        marginBottom: 4,
                      }}
                    >
                      {streak.title}
                    </Text>

                    <Text
                      style={{
                        color: theme.text,
                        opacity: 0.7,
                        marginBottom: 6,
                        fontSize: fontSize(14),
                      }}
                    >
                      Completed:{" "}
                      {new Date(streak.completed_at).toLocaleDateString()}
                    </Text>

                    <Text style={{ color: theme.text, fontSize: fontSize(14) }}>
                      Total Intervals: {streak.total_intervals}
                    </Text>

                    <Text
                      style={{
                        color: theme.primary,
                        fontSize: fontSize(14),
                        fontWeight: fontWeight(),
                      }}
                    >
                      Success: {streak.successful_intervals}
                    </Text>

                    <Text
                      style={{
                        color: "#ff4444",
                        fontSize: fontSize(14),
                        marginBottom: 10,
                      }}
                    >
                      Failures: {streak.failed_intervals}
                    </Text>

                    <Text
                      style={{
                        color: theme.text,
                        opacity: 0.8,
                        fontSize: fontSize(14),
                        marginBottom: 8,
                      }}
                    >
                      Longest Streak Run: {longest}
                    </Text>

                    <View style={{ marginTop: 10 }}>
                      <IntervalGrid theme={theme} intervals={visibleIntervals} />

                      {rowCount > 2 && (
                        <Text
                          onPress={() =>
                            setExpanded((prev) => ({
                              ...prev,
                              [streak.id]: !isExpanded,
                            }))
                          }
                          style={{
                            color: theme.primary,
                            fontSize: fontSize(14),
                            fontWeight: fontWeight(),
                            marginTop: 8,
                            textAlign: "center",
                          }}
                        >
                          {isExpanded ? "Show Less" : "Show More"}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      <BottomBar />
    </View>
  );
};

export default StatsScreen;


const IntervalGrid = ({
  theme,
  intervals,
}: {
  theme: any;
  intervals: IntervalEntry[];
}) => {
  const styles = createStatsStyles(theme);

  if (!intervals.length) {
    return <Text style={styles.emptyTextSmall}>No interval data.</Text>;
  }

  const ROW = 7;
  const rows: IntervalEntry[][] = [];

  for (let i = 0; i < intervals.length; i += ROW) {
    rows.push(intervals.slice(i, i + ROW));
  }

  return (
    <View style={styles.gridContainer}>
      {rows.map((row, idx) => (
        <View key={idx} style={styles.gridRow}>
          {row.map((entry) => (
            <IntervalTile key={entry.key} theme={theme} status={entry.status} />
          ))}
        </View>
      ))}
    </View>
  );
};

const IntervalTile = ({
  theme,
  status,
}: {
  theme: any;
  status: string;
}) => {
  const styles = createStatsStyles(theme);

  let emoji = "";
  if (status === "hit") emoji = "🔥";
  else if (status === "fail") emoji = "✖";
  else if (status === "restart") emoji = "↻";

  return (
    <View style={styles.intervalTile}>
      {emoji ? <Text style={styles.intervalEmoji}>{emoji}</Text> : null}
    </View>
  );
};
