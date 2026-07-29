// styles/WeekSelectorStyles.ts
import { StyleSheet } from "react-native";
import { scale, verticalScale } from "../utils/responsive";

export const createWeekSelectorStyles = (theme: any, fontSize: any, fontWeight: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      paddingVertical: verticalScale(8),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },

    week: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: scale(8),
    },

    dayCell: {
      flex: 1,
      alignItems: "center",
    },

    dayPill: {
      alignItems: "center",
      minWidth: scale(42),
      paddingHorizontal: scale(4),
      paddingVertical: verticalScale(8),
      borderRadius: scale(28),
    },

    dayPillSelected: {
      backgroundColor: theme.primary,
      shadowColor: theme.primary,
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: verticalScale(3) },
      shadowRadius: scale(8),
      elevation: 5,
    },

    dayNumber: {
      fontSize: fontSize(17),
      fontWeight: "700",
      color: theme.text,
    },

    dayLabel: {
      marginTop: verticalScale(2),
      fontSize: fontSize(12),
      fontWeight: fontWeight(),
      color: theme.textMuted,
    },

    dayTextActive: {
      color: theme.primary,
    },

    dayTextSelected: {
      color: theme.onPrimary,
    },

    dot: {
      marginTop: verticalScale(5),
      width: scale(6),
      height: scale(6),
      borderRadius: scale(3),
      backgroundColor: "transparent",
    },

    dotActive: {
      backgroundColor: theme.primary,
    },

    dotSelected: {
      backgroundColor: theme.onPrimary,
    },
  });
