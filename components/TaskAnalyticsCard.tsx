// components/TaskAnalyticsCard.tsx

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useThemeMode } from "../context/ThemeContext";
import { useTypography } from "../context/TypographyContext";
import { createStatsStyles } from "../styles/StatsStyles";

type ChartMode = "pie" | "bar";

interface CompletedTask {
  id: string;
  user_id: string;
  title: string;
  color: string | null;
  due_date: string | null;
  completed_at: string;
}

interface TaskAnalyticsProps {
  tasks: CompletedTask[];
}

const TaskAnalyticsCard: React.FC<TaskAnalyticsProps> = ({ tasks }) => {
  const { theme } = useThemeMode();
  const { fontSize, fontWeight } = useTypography();
  const styles = createStatsStyles(theme);

  const [mode, setMode] = useState<ChartMode>("pie");

  const totalTasks = tasks.length;

  let onTime = 0;
  let late = 0;

  tasks.forEach((t) => {
    if (!t.due_date) {
      onTime += 1;
      return;
    }
    const due = new Date(t.due_date);
    const completed = new Date(t.completed_at);
    if (completed <= due) onTime += 1;
    else late += 1;
  });

  return (
    <View style={styles.card}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: theme.text,
            fontSize: fontSize(20),
            fontWeight: fontWeight(),
          },
        ]}
      >
        Task Analytics
      </Text>

      <View style={styles.chartToggleRow}>
        <ChartToggleButton
          label="Pie"
          active={mode === "pie"}
          onPress={() => setMode("pie")}
          theme={theme}
        />
        <ChartToggleButton
          label="Bar"
          active={mode === "bar"}
          onPress={() => setMode("bar")}
          theme={theme}
        />
      </View>

      {totalTasks === 0 ? (
        <Text style={styles.emptyTextSmall}>
          No completed tasks yet. Complete some tasks to see analytics here.
        </Text>
      ) : mode === "pie" ? (
        <PieChartDisplay theme={theme} onTime={onTime} late={late} />
      ) : (
        <BarChartDisplay theme={theme} onTime={onTime} late={late} />
      )}

      <View style={styles.countRow}>
        <View style={styles.countItem}>
          <View
            style={[styles.legendDot, { backgroundColor: theme.primary }]}
          />
          <Text style={styles.countText}>On time: {onTime}</Text>
        </View>

        <View style={styles.countItem}>
          <View
            style={[styles.legendDot, { backgroundColor: "#ff7878ff" }]}
          />
          <Text style={styles.countText}>Late: {late}</Text>
        </View>

        <Text style={styles.countText}>Total: {totalTasks}</Text>
      </View>

      <Text style={styles.tasksHeader}>Completed Tasks</Text>

      <View style={styles.tasksScrollContainer}>
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} theme={theme} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};



interface ToggleProps {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: any;
}

const ChartToggleButton: React.FC<ToggleProps> = ({
  label,
  active,
  onPress,
  theme,
}) => {
  const styles = createStatsStyles(theme);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chartToggleButton,
        active && styles.chartToggleButtonActive,
      ]}
    >
      <Text style={styles.chartToggleButtonText}>{label}</Text>
    </TouchableOpacity>
  );
};



interface PieChartProps {
  theme: any;
  onTime: number;
  late: number;
}

const PieChartDisplay: React.FC<PieChartProps> = ({ theme, onTime, late }) => {
  const styles = createStatsStyles(theme);

  const size = 140;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  const total = onTime + late || 1;
  const onTimeRatio = onTime / total;
  const lateRatio = late / total;

  const onTimeLength = circumference * onTimeRatio;
  const lateLength = circumference * lateRatio;

  return (
    <View style={styles.pieContainer}>
      <Svg width={size} height={size}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={theme.card}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {onTime > 0 && (
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={theme.primary}
            strokeWidth={strokeWidth}
            strokeDasharray={`${onTimeLength} ${
              circumference - onTimeLength
            }`}
            strokeLinecap="round"
            rotation={-90}
            origin={`${cx}, ${cy}`}
            fill="transparent"
          />
        )}

        {late > 0 && (
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={"#ff7878ff"}
            strokeWidth={strokeWidth}
            strokeDasharray={`${lateLength} ${circumference - lateLength}`}
            strokeLinecap="round"
            rotation={-90}
            origin={`${cx}, ${cy}`}
            strokeDashoffset={-onTimeLength}
            fill="transparent"
          />
        )}
      </Svg>
    </View>
  );
};


interface BarProps {
  theme: any;
  onTime: number;
  late: number;
}

const BarChartDisplay: React.FC<BarProps> = ({ theme, onTime, late }) => {
  const styles = createStatsStyles(theme);

  const total = onTime + late || 1;
  const onTimePercent = (onTime / total) * 100;
  const latePercent = (late / total) * 100;

  return (
    <View style={styles.barContainer}>
      <View style={styles.barTrack}>

        <View
          style={[
            styles.barSegment,
            { backgroundColor: theme.primary, width: `${onTimePercent}%` },
          ]}
        />

        <View
          style={[
            styles.barSegment,
            { backgroundColor: "#ff7878ff", width: `${latePercent}%` },
          ]}
        />
      </View>

      <View style={styles.barLabelsRow}>
        <Text style={styles.barLabel}>On-time {onTimePercent.toFixed(0)}%</Text>
        <Text style={styles.barLabel}>Late {latePercent.toFixed(0)}%</Text>
      </View>
    </View>
  );
};



interface TaskRowProps {
  task: CompletedTask;
  theme: any;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, theme }) => {
  const styles = createStatsStyles(theme);

  const due = task.due_date ? new Date(task.due_date) : null;
  const completed = new Date(task.completed_at);

  const isLate = due && completed > due;

  return (
    <View
      style={[
        styles.taskRow,
        isLate && { borderLeftWidth: 4, borderLeftColor: theme.danger },
      ]}
    >
      <View
        style={[
          styles.taskDot,
          { backgroundColor: task.color || theme.primary },
        ]}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.taskTitle}>{task.title}</Text>

        <Text style={styles.taskSub}>
          Completed: {completed.toLocaleDateString()}
        </Text>

        {due && (
          <Text style={styles.taskSub}>
            Due: {due.toLocaleDateString()} —{" "}
            <Text style={{ opacity: isLate ? 1 : 0.6, color: theme.text }}>
              {isLate ? "Late" : "On time"}
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
};

export default TaskAnalyticsCard;
