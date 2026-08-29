// app/(tabs)/home.tsx

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Animated, View, Text, TouchableOpacity, LayoutChangeEvent } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { createHomeScreenStyles } from "../../styles/HomeScreenStyles";
import TaskAddModal from "../../components/TaskAddModal";
import TaskItem, { Task } from "../../components/TaskItem";
import AnimatedHeader from "../../components/AnimatedHeader";
import { useThemeMode } from "../../context/ThemeContext";
import { useLoading } from "../../context/LoadingContext";
import { useAuth } from "../../context/AuthProvider";
import { useRouter } from "expo-router";
import { TasksService } from "../../services/tasks";
import { useNotify } from "../../hooks/use-notify";
import BottomBar from "../../components/BottomBar";
import AgentChat from "../../components/AgentChat";
import WeekSelector from "../../components/WeekSelector";
import { useTypography } from "../../context/TypographyContext";
import { scale, verticalScale, fontScale } from "../../utils/responsive";
import {
  dateKey,
  startOfDay,
  startOfWeek,
  weeksBetween,
} from "../../utils/weekDates";

const NO_TASKS: Task[] = [];

const taskDueDate = (task: Task) =>
  task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);

export default function Home() {
  const { user, initializing } = useAuth();
  const router = useRouter();
  const { fontSize, fontWeight } = useTypography();
  const { theme } = useThemeMode();
  const styles = createHomeScreenStyles(theme);
  const { setLoading } = useLoading();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [weekStripHeight, setWeekStripHeight] = useState(verticalScale(90));

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [undoVisible, setUndoVisible] = useState(false);

  const deleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDeleteIdRef = useRef<string | null>(null);
  const archivedRef = useRef(false);
  const taskRef = useRef<Task | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!initializing && !user) router.navigate("/(tabs)/loginSignup");
  }, [user, initializing]);


  const fetchTasks = async (silent = false) => {
    if (!user) return;
    if (!silent) setLoading(true);

    try {
      const data = await TasksService.list();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  useNotify(["tasks", "completed_tasks"], () => fetchTasks(true));


  const tasksByDay = useMemo(() => {
    const map: Record<string, Task[]> = {};

    for (const task of tasks) {
      const due = taskDueDate(task);
      if (isNaN(due.getTime())) continue;

      const key = dateKey(due);
      if (!map[key]) map[key] = [];
      map[key].push(task);
    }

    return map;
  }, [tasks]);


  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const key of Object.keys(tasksByDay)) counts[key] = tasksByDay[key].length;
    return counts;
  }, [tasksByDay]);


  const weeks = useMemo(() => {
    const thisWeek = startOfWeek(new Date());
    let earliest = thisWeek;
    let latest = thisWeek;

    for (const task of tasks) {
      const due = taskDueDate(task);
      if (isNaN(due.getTime())) continue;

      const week = startOfWeek(due);
      if (!task.completed && week.getTime() < earliest.getTime()) earliest = week;
      if (week.getTime() > latest.getTime()) latest = week;
    }

    return weeksBetween(earliest, latest);
  }, [tasks]);


  const visibleTasks = useMemo(
    () => tasksByDay[dateKey(selectedDate)] ?? NO_TASKS,
    [tasksByDay, selectedDate]
  );


  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(startOfDay(date));
  }, []);


  const handleAddTask = async (text: string, color: string, dueDate: Date) => {
    if (!user) return;

    try {
      const created = await TasksService.create({
        title: text,
        color,
        due_date: dueDate?.toISOString() ?? null,
        order_index: tasks.length,
      });

      setTasks((prev) => [...prev, created]);
      setSelectedDate(startOfDay(taskDueDate(created)));
      setModalVisible(false);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };


  const handleCompleteTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    taskRef.current = task;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
    );

    try {
      await TasksService.update(id, { is_completed: true });
    } catch (err) {
      console.error("Error marking task complete:", err);

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: false } : t))
      );
      return;
    }

    pendingDeleteIdRef.current = id;
    archivedRef.current = false;
    setPendingDeleteId(id);
    setUndoVisible(true);

    if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);

    deleteTimeoutRef.current = setTimeout(async () => {
      deleteTimeoutRef.current = null;

      if (pendingDeleteIdRef.current !== id) return;

      const clearPending = () => {
        pendingDeleteIdRef.current = null;
        setPendingDeleteId(null);
        setUndoVisible(false);
      };

      if (!user) {
        clearPending();
        return;
      }

      try {
        // Backend owns the move into completed_tasks via /complete.
        await TasksService.complete(id);
        archivedRef.current = true;
      } catch (err) {
        console.error("Error archiving completed task:", err);
        clearPending();
        return;
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));
      clearPending();
    }, 3000);
  };


  const handleUndo = async () => {
    const id = pendingDeleteIdRef.current;
    if (!id) return;

    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
      deleteTimeoutRef.current = null;
    }

    try {
      if (archivedRef.current) {
        await TasksService.undoComplete(id);
      } else {
        await TasksService.update(id, { is_completed: false });
      }
    } catch (err) {
      console.error("Error undoing:", err);
    }

    setTasks((prev) => {
      const restored = prev.some((t) => t.id === id);
      if (restored) {
        return prev.map((t) => (t.id === id ? { ...t, completed: false } : t));
      }
      return taskRef.current
        ? [...prev, { ...taskRef.current, completed: false }]
        : prev;
    });

    pendingDeleteIdRef.current = null;
    archivedRef.current = false;
    setPendingDeleteId(null);
    setUndoVisible(false);
  };


  const handleDeleteTask = async (id: string) => {
    if (pendingDeleteIdRef.current === id && deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
      deleteTimeoutRef.current = null;
      pendingDeleteIdRef.current = null;
      setPendingDeleteId(null);
      setUndoVisible(false);
    }

    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await TasksService.delete(id);
    } catch (err) {
      console.error("Error deleting:", err);
      setTasks(previous);
    }
  };


  const handleDragEnd = async ({ data }: { data: Task[] }) => {
    const dayIds = new Set(data.map((task) => task.id));
    let next = 0;

    const merged = tasks.map((task) =>
      dayIds.has(task.id) ? data[next++] : task
    );

    setTasks(merged);

    const entries = merged.map((task, index) => ({
      id: task.id,
      order_index: index,
    }));

    try {
      await TasksService.reorder(entries);
    } catch (err) {
      console.error("Error reordering:", err);
      setTasks(tasks);
    }
  };


  const renderItem = ({ item, drag }: RenderItemParams<Task>) => (
    <View style={{ paddingVertical: 6 }}>
      <TaskItem
        task={item}
        drag={drag}
        onToggleComplete={() => handleCompleteTask(item.id)}
        onDelete={() => handleDeleteTask(item.id)}
        fontSize={fontSize}
        fontWeight={fontWeight}
      />
    </View>
  );

  const weekStripTop = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [verticalScale(130), verticalScale(70)],
    extrapolate: "clamp",
  });

  const handleWeekStripLayout = (event: LayoutChangeEvent) => {
    setWeekStripHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <AnimatedHeader
        scrollY={scrollY}
        onAddPress={() => setModalVisible(true)}
        styles={styles}
      />

      <Animated.View
        style={[styles.weekStripContainer, { top: weekStripTop }]}
        onLayout={handleWeekStripLayout}
      >
        <WeekSelector
          weeks={weeks}
          selectedDate={selectedDate}
          taskCounts={taskCounts}
          onSelectDate={handleSelectDate}
        />
      </Animated.View>

      <DraggableFlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        scrollEventThrottle={16}
        activationDistance={30}
        onScrollOffsetChange={(offsetY) => scrollY.setValue(offsetY)}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text
              style={[
                styles.emptyStateText,
                { fontSize: fontSize(16), fontWeight: fontWeight() },
              ]}
            >
              No tasks due on this day
            </Text>
          </View>
        }
        contentContainerStyle={{
          paddingTop: verticalScale(140) + weekStripHeight,
          paddingBottom: verticalScale(120),
        }}
      />

      <TaskAddModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTask}
      />

      {undoVisible && pendingDeleteId && (
        <TouchableOpacity
          onPress={handleUndo}
          style={{
            position: "absolute",
            bottom: verticalScale(100),
            alignSelf: "center",
            backgroundColor: theme.primary,
            paddingVertical: verticalScale(14),
            paddingHorizontal: scale(32),
            borderRadius: scale(30),
            shadowColor: theme.primary,
            shadowOpacity: 0.35,
            shadowOffset: { width: 0, height: verticalScale(4) },
            shadowRadius: scale(10),
            elevation: 8,
          }}
        >
          <Text
            style={{
              color: theme.onPrimary,
              fontSize: fontScale(18),
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Undo
          </Text>
        </TouchableOpacity>
      )}

      <AgentChat scrollY={scrollY} />

      <BottomBar />
    </View>
  );
}
