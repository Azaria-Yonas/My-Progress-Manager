// styles/TaskModalStyles.ts
import { StyleSheet } from "react-native";
import { scale, verticalScale } from "../utils/responsive";

export const createTaskModalStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: scale(20),
      marginHorizontal: scale(16),
      borderRadius: scale(16),
      backgroundColor: theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.12,
      shadowRadius: scale(12),
      shadowOffset: { width: 0, height: verticalScale(6) },
      elevation: 8,
    },

    title: {
      marginTop: verticalScale(2),
      marginBottom: verticalScale(12),
      textAlign: "center",
      color: theme.text,
    },

    input: {
      marginBottom: verticalScale(12),
      backgroundColor: theme.input,
    },

    row: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: verticalScale(10),
    },

    button: {
      marginLeft: scale(8),
    },

    label: {
      marginBottom: verticalScale(8),
      color: theme.text,
    },

    colorRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: verticalScale(15),
      marginTop: verticalScale(10),
      alignItems: "center",
      justifyContent: "center",
      width: "90%",
    },

    colorButton: {
      marginBottom: verticalScale(6),
      width: scale(38),
      height: scale(38),
      borderRadius: scale(19),
      borderWidth: 1.5,
      borderColor: theme.text + "40",
    },

    datePickerContainer: {
      alignItems: "center",
      marginVertical: verticalScale(10),
    },
  });
