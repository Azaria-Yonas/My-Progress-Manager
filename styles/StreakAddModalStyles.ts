// styles/StreakAddModalStyles.ts
import { StyleSheet } from "react-native";

export const createStreakAddModalStyles = (theme: any, fontSize: any, fontWeight: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.surface,
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 16,
    },

    title: {
      color: theme.text,
      fontSize: fontSize(26),
      fontWeight: fontWeight(),
      marginBottom: 20,
    },

    input: {
      marginBottom: 20,
      backgroundColor: "transparent",
    },

    durationLabel: {
      color: theme.text,
      fontSize: fontSize(18),
      fontWeight: fontWeight(),
      marginBottom: 10,
    },

    pickerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 5,
    },

    pickerColumn: {
      flex: 1,
      alignItems: "center",
    },

    numberDisplay: {
      fontSize: 24,
      color: theme.text,
      fontWeight: "600",
      marginVertical: 1,
    },

    bracketButton: {
      paddingHorizontal: 14,
      paddingVertical: 2,
      alignItems: "center",
      justifyContent: "center",
    },

    bracketButtonTextPrimary: {
      fontSize: 30,
      fontWeight: "bold",
      color: theme.primary,
    },

    actionRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 10,
    },

    addButton: {
      marginLeft: 12,
    },
  });
