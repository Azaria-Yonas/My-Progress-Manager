// styles/StatsStyles.ts
import { StyleSheet } from "react-native";
import { scale, verticalScale, fontScale } from "../utils/responsive";

export const createStatsStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: verticalScale(60),
    },

    scrollContent: {
      paddingHorizontal: scale(20),
      paddingBottom: verticalScale(80),
      paddingTop: verticalScale(130),
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },

    card: {
      padding: scale(20),
      borderRadius: scale(16),
      marginTop: verticalScale(10),
      marginBottom: verticalScale(20),
      backgroundColor: theme.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.08,
      shadowRadius: scale(6),
      shadowOffset: { width: 0, height: verticalScale(2) },
      elevation: 4,
    },

    sectionTitle: {
      marginBottom: verticalScale(12),
    },

    emptyTextSmall: {
      marginTop: verticalScale(8),
      color: theme.textMuted,
      fontSize: fontScale(13),
      textAlign: "center",
    },

    gridContainer: {
      marginTop: verticalScale(16),
    },

    gridRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(6),
    },

    intervalTile: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(10),
      marginRight: scale(6),
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
      borderColor: theme.border,
      backgroundColor: theme.card,
      opacity: 0.5,
    },

    intervalFail: {
      borderColor: theme.danger,
      backgroundColor: theme.danger + "33",
    },

    intervalRestart: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + "40",
    },

    intervalEmoji: {
      fontSize: fontScale(18),
      color: theme.text,
    },

    chartToggleRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: verticalScale(12),
      marginTop: verticalScale(4),
    },

    chartToggleButton: {
      paddingVertical: verticalScale(8),
      paddingHorizontal: scale(18),
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: theme.primary + "66",
      marginHorizontal: scale(6),
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
      marginVertical: verticalScale(10),
    },

    barContainer: {
      marginTop: verticalScale(10),
      marginBottom: verticalScale(6),
    },

    barTrack: {
      height: verticalScale(22),
      borderRadius: scale(12),
      backgroundColor: theme.input,
      flexDirection: "row",
      overflow: "hidden",
    },

    barSegment: {
      height: "100%",
    },

    barLabelsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: verticalScale(6),
      paddingHorizontal: scale(4),
    },

    barLabel: {
      color: theme.textMuted,
      fontSize: fontScale(13),
    },

    countRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: verticalScale(10),
      marginBottom: verticalScale(12),
    },

    countItem: {
      flexDirection: "row",
      alignItems: "center",
    },

    legendDot: {
      width: scale(10),
      height: scale(10),
      borderRadius: scale(5),
      marginRight: scale(6),
    },

    countText: {
      color: theme.textMuted,
      fontSize: fontScale(14),
    },

    tasksHeader: {
      color: theme.text,
      fontSize: fontScale(16),
      fontWeight: "600",
      marginBottom: verticalScale(6),
      marginTop: verticalScale(6),
    },

    tasksScrollContainer: {
      maxHeight: verticalScale(220),
      paddingRight: scale(4),
    },

    taskRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: verticalScale(8),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },

    taskDot: {
      width: scale(12),
      height: scale(12),
      borderRadius: scale(6),
      marginRight: scale(12),
      marginTop: verticalScale(4),
    },

    taskTitle: {
      color: theme.text,
      fontSize: fontScale(16),
      fontWeight: "600",
      marginBottom: verticalScale(2),
    },

    taskSub: {
      color: theme.textMuted,
      fontSize: fontScale(13),
    },
  });
