import { StyleSheet } from "react-native";

export const createLoginSignupStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 30,
      paddingTop: 50,
      justifyContent: "space-between",
      backgroundColor: "transparent",
    },

    logoBox: {
      marginTop: 0,
      width: "50%",
      height: "20%",
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: "transparent",
      marginBottom: 30,
    },

    logoImage: {
      width: "100%",
      height: "100%",
    },

    welcomeBox: {
      width: "95%",
      flex: 1,
      borderRadius: 25,
      alignSelf: "center",
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 10,
      elevation: 4,
    },

    welcomeInner: {
      flex: 1,
      borderRadius: 25,
      padding: 20,
      overflow: "hidden",

      backgroundColor: theme.input,

    },

    welcomeScroll: {
      flexGrow: 0,
    },

    welcomeText: {
      fontSize: 29,
      fontWeight: "700",
      marginBottom: 10,
      textAlign: "center",
      color: theme.text,
    },

    introText: {
      fontSize: 14,
      fontFamily: "RobotoThin",
      lineHeight: 18,
      textAlign: "justify",
      color: theme.text,
      opacity: 0.85,
    },

    getStartedButton: {
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 30,
      marginTop: 30,
      marginBottom: 20,

      backgroundColor: theme.primary ,

      shadowColor: theme.primary,
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 10,

      overflow: "hidden",
      opacity: 0.97,
    },

    getStartedButtonText: {
      fontSize: 18,
      fontWeight: "500",
      color: theme.text,
      textAlign: "center",
    },
  });
