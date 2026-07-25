// app/(tabs)/home.tsx

import React, { useState, useEffect, useRef } from "react";
import { Animated, View, Text, TouchableOpacity } from "react-native";
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
import BottomBar from "../../components/BottomBar";
import AgentChat from "../../components/AgentChat";
import { useTypography } from "../../context/TypographyContext";
import { scale, verticalScale, fontScale } from "../../utils/responsive";

export default function Home() {
  const { user, initializing } = useAuth();
  const router = useRouter();
  const { fontSize, fontWeight } = useTypography();
  const { theme } = useThemeMode();
  const styles = createHomeScreenStyles(theme);
  const { setLoading } = useLoading();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [undoVisible, setUndoVisible] = useState(false);

  const deleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDeleteIdRef = useRef<string | null>(null);
  const taskRef = useRef<Task | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!initializing && !user) router.replace("/(tabs)/loginSignup");
  }, [user, initializing]);


  const fetchTasks = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const data = await TasksService.list();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);


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
    setPendingDeleteId(id);
    setUndoVisible(true);

    if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);

    deleteTimeoutRef.current = setTimeout(async () => {
      if (pendingDeleteIdRef.current !== id) return;
      if (!user) return;

      try {
        // Backend owns the move into completed_tasks via /complete.
        await TasksService.complete(id);
      } catch (err) {
        console.error("Error archiving completed task:", err);
        return;
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));

      pendingDeleteIdRef.current = null;
      setPendingDeleteId(null);
      setUndoVisible(false);
      deleteTimeoutRef.current = null;
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
      await TasksService.undoComplete(id);
    } catch (err) {
      console.error("Error undoing:", err);
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: false } : t))
    );

    pendingDeleteIdRef.current = null;
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
    setTasks(data);

    const entries = data.map((task, index) => ({
      id: task.id,
      order_index: index,
    }));

    try {
      await TasksService.reorder(entries);
    } catch (err) {
      console.error("Error reordering:", err);
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <AnimatedHeader
        scrollY={scrollY}
        onAddPress={() => setModalVisible(true)}
        styles={styles}
      />

      <DraggableFlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        scrollEventThrottle={16}
        activationDistance={30}
        onScrollOffsetChange={(offsetY) => scrollY.setValue(offsetY)}
        contentContainerStyle={{ paddingTop: verticalScale(140), paddingBottom: verticalScale(120) }}
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
