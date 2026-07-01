// styles/StreakItemStyles.ts
import { StyleSheet } from "react-native";
import { scale, verticalScale, fontScale } from "../utils/responsive";

export const createStreakItemStyles = (theme: any, fontSize: any, fontWeight: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.primary + "1F",

      padding: scale(20),
      borderRadius: scale(20),

      borderWidth: 1,
      borderColor: theme.primary + "3D",

      shadowColor: theme.primary,
      shadowOpacity: 0.22,
      shadowOffset: { width: 0, height: verticalScale(8) },
      shadowRadius: scale(18),
      elevation: 8,

      marginBottom: verticalScale(20),
      overflow: "hidden",
      position: "relative",
    },

    deleteBtn: {
      position: "absolute",
      top: scale(10),
      right: scale(10),
      padding: scale(6),
      backgroundColor: theme.primary + "33",
      borderRadius: scale(20),
    },

    title: {
      fontSize: fontScale(28),
      fontWeight: "700",
      color: theme.text,
      marginBottom: verticalScale(8),
      paddingRight: scale(36),
    },

    streakCount: {
      fontSize: fontSize(30),
      fontWeight: fontWeight(),
      textAlign: "center",
      color: theme.text,
      marginBottom: verticalScale(12),
    },

    timer: {
      fontSize: fontSize(32),
      fontWeight: fontWeight(),
      color: theme.primary,
      textAlign: "center",
    },

    readyText: {
      fontSize: fontSize(14),
      color: theme.text,
      opacity: 0.6,
      textAlign: "center",
    },

    button: {
      marginTop: verticalScale(20),
      paddingVertical: verticalScale(12),
      borderRadius: scale(12),
      alignItems: "center",
      backgroundColor: theme.primary + "55",
    },

    buttonText: {
      fontSize: fontSize(18),
      fontWeight: fontWeight(),
      color: theme.text,
    },
  });
