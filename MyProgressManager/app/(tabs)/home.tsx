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
import { useRouter } from "expo-router";
import BottomBar from "../../components/BottomBar";
import { useTypography } from "../../context/TypographyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https://my-progress-manager.onrender.com";
const TOKEN_KEY = "access_token";

export default function Home() {
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

  const apiFetch = async (endpoint: string, options: any = {}) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);

    if (!token) {
      router.replace("/(tabs)/loginSignup");
      return;
    }

    const res = await fetch(`${API}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    if (res.status === 401) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      router.replace("/(tabs)/loginSignup");
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "API error");
    }

    return data;
  };

  const fetchTasks = async () => {
    setLoading(true);

    try {
      const data = await apiFetch("/tasks");

      if (!data) return;

      const mapped: Task[] = data.map((t: any) => ({
        id: t.id,
        text: t.title,
        completed: t.is_completed,
        color: t.color,
        dueDate: t.due_date ? new Date(t.due_date) : new Date(),
      }));

      setTasks(mapped);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (text: string, color: string, dueDate: Date) => {
    try {
      const row = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: text,
          color,
          due_date: dueDate?.toISOString() ?? null,
        }),
      });

      if (!row) return;

      setTasks((prev) => [
        ...prev,
        {
          id: row.id,
          text,
          completed: false,
          color,
          dueDate,
        },
      ]);

      setModalVisible(false);
    } catch (error) {
      console.error("Add error:", error);
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
      await apiFetch(`/tasks/${id}/complete`, { method: "PUT" });
    } catch (error) {
      console.error("Complete error:", error);
    }

    pendingDeleteIdRef.current = id;
    setPendingDeleteId(id);
    setUndoVisible(true);

    if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);

    deleteTimeoutRef.current = setTimeout(async () => {
      if (pendingDeleteIdRef.current !== id) return;

      try {
        await apiFetch(`/tasks/${id}`, { method: "DELETE" });
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } catch (error) {
        console.error("Delete error:", error);
      }

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
      await apiFetch(`/tasks/${id}/undo`, { method: "PUT" });
    } catch (error) {
      console.error("Undo error:", error);
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: false } : t))
    );

    pendingDeleteIdRef.current = null;
    setPendingDeleteId(null);
    setUndoVisible(false);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleDragEnd = async ({ data }: { data: Task[] }) => {
    setTasks(data);

    for (let i = 0; i < data.length; i++) {
      try {
        await apiFetch(`/tasks/${data[i].id}/reorder`, {
          method: "PUT",
          body: JSON.stringify({ order_index: i }),
        });
      } catch (error) {
        console.error("Reorder error:", error);
      }
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
        contentContainerStyle={{ paddingTop: 140, paddingBottom: 120 }}
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
            bottom: 80,
            alignSelf: "center",
            backgroundColor: theme.primary,
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 30,
            elevation: 5,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Undo
          </Text>
        </TouchableOpacity>
      )}

      <BottomBar />
    </View>
  );
}