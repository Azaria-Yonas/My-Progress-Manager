// styles/StreakItemStyles.ts
import { StyleSheet } from "react-native";

export const createStreakItemStyles = (theme: any, fontSize: any, fontWeight: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.primary + "20", 

      padding: 20,
      borderRadius: 20,

      backdropFilter: "blur(20px)",       

      borderWidth: 1,
      borderColor: theme.primary + "40",   

      shadowColor: theme.primary,
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 20,
      elevation: 10,

      marginBottom: 20,
      overflow: "hidden",
      position: "relative",
    },

    deleteBtn: {
      position: "absolute",
      top: 10,
      right: 10,
      padding: 6,
      backgroundColor: theme.primary + "33",
      borderRadius: 20,
    },

    title: {
      fontSize: 30,
      fontWeight: 700,
      color: theme.text,
      marginBottom: 8,
      paddingRight: 35,
    },

    streakCount: {
      fontSize: fontSize(30),
      fontWeight: fontWeight(),
      textAlign: "center",
      color: theme.text,
      marginBottom: 12,
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
      marginTop: 20,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: theme.primary + "55", 
    },

    buttonText: {
      fontSize: fontSize(18),
      fontWeight: fontWeight(),
      color: theme.text,
    },
  });
