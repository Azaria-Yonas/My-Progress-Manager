import { StyleSheet } from "react-native";
import { scale, verticalScale, fontScale } from "../utils/responsive";

export const createStreaksScreenStyles = (theme: any) =>
  StyleSheet.create({
    headerContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      opacity: 0.96,
      backgroundColor: theme.background,
      zIndex: 10,
      elevation: 6,
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(60),
      paddingBottom: verticalScale(6),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      shadowColor: theme.shadowcolor,
      shadowOffset: { width: 0, height: verticalScale(4) },
      shadowOpacity: 0.1,
      shadowRadius: scale(6),
    },

    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    title: {
      fontSize: fontScale(58),
      fontWeight: "700",
      letterSpacing: -0.5,
      textAlign: "left",
      color: theme.text,
    },

    container: {
      flex: 1,
      paddingHorizontal: scale(16),
    },

    scrollContent: {
      paddingTop: verticalScale(140),
      paddingBottom: verticalScale(80),
    },

    streakCard: {
      backgroundColor: theme.card,
      padding: scale(20),
      borderRadius: scale(16),
      marginBottom: verticalScale(20),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: verticalScale(4) },
      shadowRadius: scale(8),
      elevation: 4,
    },

    streakTitle: {
      fontSize: fontScale(20),
      fontWeight: "600",
      color: theme.text,
    },

    streakTimer: {
      fontSize: fontScale(28),
      fontWeight: "700",
      color: theme.primary,
      marginTop: verticalScale(10),
      textAlign: "center",
    },

    streakButton: {
      marginTop: verticalScale(20),
      paddingVertical: verticalScale(12),
      borderRadius: scale(12),
      alignItems: "center",
    },

    streakButtonText: {
      fontSize: fontScale(18),
      fontWeight: "600",
      color: theme.text,
    },

    addCircleButton: {
      width: scale(42),
      height: scale(42),
      borderRadius: scale(21),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.primary,
      shadowColor: theme.primary,
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: verticalScale(4) },
      shadowRadius: scale(10),
      elevation: 8,
    },

    addButtonText: {
      color: theme.onPrimary,
      fontSize: fontScale(26),
      lineHeight: fontScale(28),
      textAlign: "center",
    },
  });
