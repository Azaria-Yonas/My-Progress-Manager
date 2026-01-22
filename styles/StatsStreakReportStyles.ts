import { StyleSheet } from "react-native";

export const createStatsStreakReportStyles = (theme: any) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 20,
      marginBottom: 25,

      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },

    cardTitle: {
      fontSize: 26,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 12,
    },

    innerScroll: {
      maxHeight: 300,
    },

    reportItem: {
      backgroundColor: theme.primary + "20",

      padding: 16,
      borderRadius: 16,

      backdropFilter: "blur(20px)",
      borderWidth: 1,
      borderColor: theme.primary + "40",

      shadowColor: theme.primary,
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 16,
      elevation: 10,

      marginBottom: 16,
    },

    reportTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 6,
    },

    reportText: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 4,
    },

    highlight: {
      color: theme.primary,
      fontWeight: "700",
    },

    failHighlight: {
      color: "#ff4c4c",
      fontWeight: "700",
    },
  });
