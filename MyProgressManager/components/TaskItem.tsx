// components/TaskItem.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { IconButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "../context/ThemeContext";
import { getContrastTextColor } from "../constants/Colors";
import { useTypography } from "../context/TypographyContext"; 

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  color: string;
  dueDate: Date;
};

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  drag?: () => void;

  fontSize: (n: number) => number;
  fontWeight: () => "normal" | "700";
}

export default function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  drag,
  fontSize,
  fontWeight,
}: TaskItemProps) {
  const { theme } = useThemeMode();
  const [hovered, setHovered] = useState(false);

  const textColor = getContrastTextColor(task.color ?? theme.background);

  const dueDate =
    task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);

  const hasTime = dueDate.getHours() !== 0 || dueDate.getMinutes() !== 0;

  const formattedTime = dueDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const styles = createTaskItemStyles(theme, task, hovered, textColor, fontSize, fontWeight);

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
      style={styles.container}
    >
      <TouchableOpacity onLongPress={drag} style={styles.dragHandle}>
        <Ionicons name="menu" size={20} color={theme.text} />
      </TouchableOpacity>

      <Pressable
        style={styles.taskArea}
        onHoverIn={() => Platform.OS === "web" && setHovered(true)}
        onHoverOut={() => Platform.OS === "web" && setHovered(false)}
      >
        <IconButton
          icon={task.completed ? "check-circle" : "checkbox-blank-circle-outline"}
          onPress={() => onToggleComplete(task.id)}
          iconColor={task.completed ? theme.success : theme.text}
          size={26}
        />

        <View style={styles.textArea}>

          <Text
            style={[
              styles.title,
              task.completed && { textDecorationLine: "line-through", opacity: 0.6 },
            ]}
          >
            {task.text}
          </Text>

          <Text style={styles.dueDate}>
            Due: {dueDate.toLocaleDateString()}
            {hasTime ? ` at ${formattedTime}` : ""}
          </Text>

        </View>
      </Pressable>

      <IconButton icon="delete" onPress={() => onDelete(task.id)} iconColor={theme.text} />
    </Animated.View>
  );
}

function createTaskItemStyles(
  theme: any,
  task: Task,
  hovered: boolean,
  textColor: string,
  fontSize: (n: number) => number,
  fontWeight: () => "normal" | "700"
) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: task.color,
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 12,
      marginVertical: 6,
      marginHorizontal: 15,
      opacity: hovered ? 0.9 : 1,
      borderWidth: task.completed ? 2 : 0,
      borderColor: task.completed ? theme.success : "transparent",
      shadowColor: theme.shadowcolor,
      shadowOffset: { width: 0, height: 0.1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 3,
    },

    dragHandle: {
      padding: 6,
      justifyContent: "center",
      alignItems: "center",
    },

    taskArea: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      paddingLeft: 4,
    },

    textArea: {
      flex: 1,
      paddingLeft: 8,
    },

    title: {
      fontSize: fontSize(18),
      fontWeight: fontWeight(),
      color: textColor,
    },

    dueDate: {
      marginTop: 2,
      fontSize: fontSize(14),
      fontWeight: fontWeight(),
      color: textColor,
      opacity: 0.75,
    },
  });
}
