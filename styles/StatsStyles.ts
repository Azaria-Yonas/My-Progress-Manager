// styles/StatsStyles.ts
import { StyleSheet } from "react-native";

export const createStatsStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 60,
    },

    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 80,
      paddingTop: 130,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },


    card: {
      padding: 20,
      borderRadius: 16,
      marginTop: 10,
      marginBottom: 20,
      backgroundColor: theme.card,
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.06,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 6,
    },

    sectionTitle: {
      marginBottom: 12,
    },


    emptyTextSmall: {
      marginTop: 8,
      color: theme.text,
      opacity: 0.7,
      fontSize: 13,
      textAlign: "center",
    },


    gridContainer: {
      marginTop: 16,
    },

    gridRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },

    intervalTile: {
      width: 32,
      height: 32,
      borderRadius: 10,
      marginRight: 6,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      backgroundColor: theme.card,
    },

    intervalHit: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + "26",
    },

    intervalMiss: {
      borderColor: theme.shadowcolor,
      backgroundColor: theme.card,
      opacity: 0.5,
    },

    intervalFail: {
      borderColor: "#ff4a4a",
      backgroundColor: "#ff4a4a33",
    },

    intervalRestart: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + "40",
    },

    intervalEmoji: {
      fontSize: 18,
      color: theme.text,
    },


    chartToggleRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 12,
      marginTop: 4,
    },

    chartToggleButton: {
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.primary + "66",
      marginHorizontal: 6,
      backgroundColor: theme.card,
    },

    chartToggleButtonActive: {
      backgroundColor: theme.primary,
    },

    chartToggleButtonText: {
      color: theme.text,
      fontWeight: "600",
    },


    pieContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
    },


    barContainer: {
      marginTop: 10,
      marginBottom: 6,
    },

    barTrack: {
      height: 22,
      borderRadius: 12,
      backgroundColor: theme.background,
      flexDirection: "row",
      overflow: "hidden",
    },

    barSegment: {
      height: "100%",
    },

    barLabelsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 6,
      paddingHorizontal: 4,
    },

    barLabel: {
      color: theme.text,
      opacity: 0.75,
      fontSize: 13,
    },

    countRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
      marginBottom: 12,
    },

    countItem: {
      flexDirection: "row",
      alignItems: "center",
    },

    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 6,
    },

    countText: {
      color: theme.text,
      opacity: 0.8,
      fontSize: 14,
    },

    tasksHeader: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 6,
      marginTop: 6,
    },

    tasksScrollContainer: {
      maxHeight: 220,
      paddingRight: 4,
    },

    taskRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: 8,
      borderBottomWidth: 0.5,
      borderColor: theme.shadowcolor + "55",
    },

    taskDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 12,
      marginTop: 4,
    },

    taskTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 2,
    },

    taskSub: {
      color: theme.text,
      opacity: 0.65,
      fontSize: 13,
    },
  });
