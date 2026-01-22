import React from "react";
import { View, Text } from "react-native";
import { useThemeMode } from "../context/ThemeContext";
import { createStatsStreakReportStyles } from "../styles/StatsStreakReportStyles";

interface Props {
  reports: Array<{
    id: string;
    title: string;
    streak_count: number;
    duration_seconds: number;
    successful_intervals: number;
    failed_intervals: number;
  }>;
}

export default function StreakReportCard({ reports }: Props) {
  const { theme } = useThemeMode();
  const styles = createStatsStreakReportStyles(theme);

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>Streak Report</Text>

      <View style={styles.innerScroll}>
        {reports.map((r) => (
          <View key={r.id} style={styles.reportItem}>
            <Text style={styles.reportTitle}>{r.title}</Text>

            <Text style={styles.reportText}>
              Streak Count: <Text style={styles.highlight}>{r.streak_count}</Text>
            </Text>

            <Text style={styles.reportText}>
              Success:{" "}
              <Text style={styles.highlight}>{r.successful_intervals}</Text> | Fail:{" "}
              <Text style={styles.failHighlight}>{r.failed_intervals}</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
