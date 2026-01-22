import { StyleSheet } from "react-native";

export const createStreaksScreenStyles = (theme: any) =>
  StyleSheet.create({
    headerContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      opacity: 0.93,
      backgroundColor: theme.background,
      zIndex: 10,
      elevation: 6,
      paddingHorizontal: 10,
      paddingTop: 60,
      paddingBottom: 1,
      shadowColor: theme.shadowcolor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },

    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    title: {
      fontSize: 62,
      fontWeight: "bold",
      textAlign: "left",
      color: theme.text,
    },

    container: {
      flex: 1,
      paddingHorizontal: 15,
    },

    scrollContent: {
      paddingTop: 140,
      paddingBottom: 80,
    },

    streakCard: {
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 15,
      marginBottom: 20,
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 4,
    },

    streakTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
    },

    streakTimer: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.primary,
      marginTop: 10,
      textAlign: "center",
    },

    streakButton: {
      marginTop: 20,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
    },

    streakButtonText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
    },

    addCircleButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.primary + "87",

      shadowColor: theme.primary,
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 10,
      overflow: "hidden",
      opacity: 0.97,
    },

    addButtonText: {
      color: theme.text,
      fontSize: 28,
      lineHeight: 28,
      textAlign: "center",
    },
  });
