import { StyleSheet } from "react-native";
import { scale, verticalScale, fontScale } from "../utils/responsive";

export const createStatsStreakReportStyles = (theme: any) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: theme.card,
      padding: scale(20),
      borderRadius: scale(20),
      marginBottom: verticalScale(25),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.1,
      shadowRadius: scale(8),
      shadowOffset: { width: 0, height: verticalScale(4) },
      elevation: 4,
    },

    cardTitle: {
      fontSize: fontScale(26),
      fontWeight: "700",
      color: theme.text,
      marginBottom: verticalScale(12),
    },

    innerScroll: {
      maxHeight: verticalScale(300),
    },

    reportItem: {
      backgroundColor: theme.primary + "1F",

      padding: scale(16),
      borderRadius: scale(16),

      borderWidth: 1,
      borderColor: theme.primary + "3D",

      shadowColor: theme.primary,
      shadowOpacity: 0.22,
      shadowOffset: { width: 0, height: verticalScale(6) },
      shadowRadius: scale(14),
      elevation: 6,

      marginBottom: verticalScale(16),
    },

    reportTitle: {
      fontSize: fontScale(20),
      fontWeight: "700",
      color: theme.text,
      marginBottom: verticalScale(6),
    },

    reportText: {
      fontSize: fontScale(16),
      color: theme.text,
      marginBottom: verticalScale(4),
    },

    highlight: {
      color: theme.primary,
      fontWeight: "700",
    },

    failHighlight: {
      color: theme.danger,
      fontWeight: "700",
    },
  });
