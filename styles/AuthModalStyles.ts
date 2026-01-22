import { StyleSheet } from "react-native";

export const createAuthModalStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "#00000088",
      justifyContent: "center",
      padding: 20,
    },

    box: {
      borderRadius: 20,
      padding: 40,
      backgroundColor: theme.background,
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.15,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },

    title: {
      fontSize: 26,
      fontWeight: "700",
      marginBottom: 20,
      textAlign: "center",
      color: theme.text,
    },

    input: {
      padding: 12,
      borderRadius: 10,
      marginBottom: 12,
    backgroundColor: theme.card,
      color: theme.text,
    },

    button: {
      padding: 14,
      borderRadius: 10,
      marginVertical: 10,
      backgroundColor: theme.primary,
    },

    buttonText: {
      color: "#fff",
      fontWeight: "600",
      textAlign: "center",
    },

    link: {
      textAlign: "center",
      marginTop: 10,
      fontSize: 14,
      color: theme.primary,
    },

    closeText: {
      marginTop: 20,
      textAlign: "center",
      color: theme.text,
    },
  });
