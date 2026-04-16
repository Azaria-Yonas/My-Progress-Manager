import React from "react";
import { View, Text } from "react-native";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 20 }}>
        HOME SCREEN
      </Text>
    </View>
  );
}



// // app/(tabs)/home.tsx

// import React, { useState, useEffect, useRef } from "react";
// import { Animated, View, Text, TouchableOpacity } from "react-native";
// import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
// import { createHomeScreenStyles } from "../../styles/HomeScreenStyles";
// import TaskAddModal from "../../components/TaskAddModal";
// import TaskItem, { Task } from "../../components/TaskItem";
// import AnimatedHeader from "../../components/AnimatedHeader";
// import { useThemeMode } from "../../context/ThemeContext";
// import { useLoading } from "../../context/LoadingContext";
// import { useAuth } from "../../context/AuthProvider";
// import { useRouter } from "expo-router";
// import { supabase } from "../../lib/supabaseClient";
// import BottomBar from "../../components/BottomBar";
// import { useTypography } from "../../context/TypographyContext";

// export default function Home() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const { fontSize, fontWeight } = useTypography();
//   const { theme } = useThemeMode();
//   const styles = createHomeScreenStyles(theme);
//   const { setLoading } = useLoading();

//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [modalVisible, setModalVisible] = useState(false);

//   const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
//   const [undoVisible, setUndoVisible] = useState(false);

//   const deleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const pendingDeleteIdRef = useRef<string | null>(null);
//   const taskRef = useRef<Task | null>(null);

//   const scrollY = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (!user) router.replace("/(tabs)/loginSignup");
//   }, [user]);


//   const fetchTasks = async () => {
//     if (!user?.id) return;
//     setLoading(true);

//     try {
//       const { data, error } = await supabase
//         .from("tasks")
//         .select("*")
//         .eq("user_id", user.id)
//         .order("order_index", { ascending: true });

//       if (error) {
//         console.error("Error fetching tasks:", error);
//         return;
//       }

//       const mapped: Task[] = (data ?? []).map((t: any) => ({
//         id: t.id,
//         text: t.title,
//         completed: t.is_completed,
//         color: t.color,
//         dueDate: t.due_date ? new Date(t.due_date) : new Date(),
//       }));

//       setTasks(mapped);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchTasks();
//   }, [user]);


//   const handleAddTask = async (text: string, color: string, dueDate: Date) => {
//     if (!user?.id) return;

//     const { data, error } = await supabase
//       .from("tasks")
//       .insert([
//         {
//           user_id: user.id,
//           title: text,
//           is_completed: false,
//           color,
//           due_date: dueDate?.toISOString() ?? null,
//           order_index: tasks.length,
//         },
//       ])
//       .select("*");

//     if (error) {
//       console.error("Error adding task:", error);
//       return;
//     }

//     const row = data?.[0];
//     if (!row) return;

//     const newTask: Task = {
//       id: row.id,
//       text,
//       completed: false,
//       color,
//       dueDate,
//     };

//     setTasks((prev) => [...prev, newTask]);
//     setModalVisible(false);
//   };


//   const handleCompleteTask = async (id: string) => {
//     const task = tasks.find((t) => t.id === id);
//     if (!task) return;

//     taskRef.current = task;

//     setTasks((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
//     );

//     const { error } = await supabase
//       .from("tasks")
//       .update({ is_completed: true })
//       .eq("id", id);

//     if (error) {
//       console.error("Error marking task complete:", error);
//       return;
//     }

//     pendingDeleteIdRef.current = id;
//     setPendingDeleteId(id);
//     setUndoVisible(true);

//     if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);

//     deleteTimeoutRef.current = setTimeout(async () => {
//       if (pendingDeleteIdRef.current !== id) return;
//       if (!user?.id) return;
//       const { error: insertError } = await supabase
//         .from("completed_tasks")
//         .insert([
//           {
//             user_id: user.id, 
//             title: taskRef.current?.text,
//             color: taskRef.current?.color,
//             due_date: taskRef.current?.dueDate?.toISOString() ?? null,
//             completed_at: new Date().toISOString(),
//           },
//         ]);

//       if (insertError) {
//         console.error("Error inserting into completed_tasks:", insertError);
//         return;
//       }

//       const { error: deleteError } = await supabase
//         .from("tasks")
//         .delete()
//         .eq("id", id);

//       if (deleteError) {
//         console.error("Error deleting from tasks:", deleteError);
//         return;
//       }

//       setTasks((prev) => prev.filter((t) => t.id !== id));

//       pendingDeleteIdRef.current = null;
//       setPendingDeleteId(null);
//       setUndoVisible(false);
//       deleteTimeoutRef.current = null;
//     }, 3000);
//   };


//   const handleUndo = async () => {
//     const id = pendingDeleteIdRef.current;
//     if (!id) return;

//     if (deleteTimeoutRef.current) {
//       clearTimeout(deleteTimeoutRef.current);
//       deleteTimeoutRef.current = null;
//     }

//     const { error } = await supabase
//       .from("tasks")
//       .update({ is_completed: false })
//       .eq("id", id);

//     if (error) console.error("Error undoing:", error);

//     setTasks((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, completed: false } : t))
//     );

//     pendingDeleteIdRef.current = null;
//     setPendingDeleteId(null);
//     setUndoVisible(false);
//   };


//   const handleDeleteTask = async (id: string) => {
//     if (pendingDeleteIdRef.current === id && deleteTimeoutRef.current) {
//       clearTimeout(deleteTimeoutRef.current);
//       deleteTimeoutRef.current = null;
//       pendingDeleteIdRef.current = null;
//       setPendingDeleteId(null);
//       setUndoVisible(false);
//     }

//     const { error } = await supabase.from("tasks").delete().eq("id", id);

//     if (error) {
//       console.error("Error deleting:", error);
//       return;
//     }

//     setTasks((prev) => prev.filter((t) => t.id !== id));
//   };


//   const handleDragEnd = async ({ data }: { data: Task[] }) => {
//     setTasks(data);

//     for (let index = 0; index < data.length; index++) {
//       const task = data[index];
//       const { error } = await supabase
//         .from("tasks")
//         .update({ order_index: index })
//         .eq("id", task.id);

//       if (error) console.error("Error order:", error);
//     }
//   };


//   const renderItem = ({ item, drag }: RenderItemParams<Task>) => (
//     <View style={{ paddingVertical: 6 }}>
//       <TaskItem
//         task={item}
//         drag={drag}
//         onToggleComplete={() => handleCompleteTask(item.id)}
//         onDelete={() => handleDeleteTask(item.id)}
//         fontSize={fontSize}
//         fontWeight={fontWeight}
//       />
//     </View>
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: theme.background }}>
//       <AnimatedHeader
//         scrollY={scrollY}
//         onAddPress={() => setModalVisible(true)}
//         styles={styles}
//       />

//       <DraggableFlatList
//         data={tasks}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         onDragEnd={handleDragEnd}
//         scrollEventThrottle={16}
//         activationDistance={30}
//         onScrollOffsetChange={(offsetY) => scrollY.setValue(offsetY)}
//         contentContainerStyle={{ paddingTop: 140, paddingBottom: 120 }}
//       />

//       <TaskAddModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         onAdd={handleAddTask}
//       />

//       {undoVisible && pendingDeleteId && (
//         <TouchableOpacity
//           onPress={handleUndo}
//           style={{
//             position: "absolute",
//             bottom: 80,
//             alignSelf: "center",
//             backgroundColor: theme.primary,
//             paddingVertical: 14,
//             paddingHorizontal: 32,
//             borderRadius: 30,
//             elevation: 5,
//           }}
//         >
//           <Text
//             style={{
//               color: "white",
//               fontSize: 18,
//               fontWeight: "700",
//               textAlign: "center",
//             }}
//           >
//             Undo
//           </Text>
//         </TouchableOpacity>
//       )}

//       <BottomBar />
//     </View>
//   );
// }
