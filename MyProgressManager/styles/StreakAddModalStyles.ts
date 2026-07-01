// styles/StreakAddModalStyles.ts
import { StyleSheet } from "react-native";
import { scale, verticalScale, fontScale } from "../utils/responsive";

export const createStreakAddModalStyles = (theme: any, fontSize: any, fontWeight: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.surface,
      marginHorizontal: scale(20),
      padding: scale(20),
      borderRadius: scale(16),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.12,
      shadowRadius: scale(12),
      shadowOffset: { width: 0, height: verticalScale(6) },
      elevation: 8,
    },

    title: {
      color: theme.text,
      fontSize: fontSize(26),
      fontWeight: fontWeight(),
      marginBottom: verticalScale(20),
    },

    input: {
      marginBottom: verticalScale(20),
      backgroundColor: "transparent",
    },

    durationLabel: {
      color: theme.text,
      fontSize: fontSize(18),
      fontWeight: fontWeight(),
      marginBottom: verticalScale(10),
    },

    pickerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: verticalScale(5),
    },

    pickerColumn: {
      flex: 1,
      alignItems: "center",
    },

    numberDisplay: {
      fontSize: fontScale(24),
      color: theme.text,
      fontWeight: "600",
      marginVertical: verticalScale(1),
    },

    bracketButton: {
      paddingHorizontal: scale(14),
      paddingVertical: verticalScale(2),
      alignItems: "center",
      justifyContent: "center",
    },

    bracketButtonTextPrimary: {
      fontSize: fontScale(30),
      fontWeight: "bold",
      color: theme.primary,
    },

    actionRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: verticalScale(10),
    },

    addButton: {
      marginLeft: scale(12),
    },
  });
