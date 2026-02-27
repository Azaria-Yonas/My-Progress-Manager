// styles/ProfileStyles.ts
import { StyleSheet } from "react-native";

export const createProfileStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 60,
    },

    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 80,
      paddingTop: 130,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },

    card: {
      padding: 20,
      borderRadius: 16,
      marginTop: 20,
      marginBottom: 25,
      backgroundColor: theme.card,
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.06,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 6,
    },

    sectionTitle: {
      marginBottom: 12,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
    },

    settingButton: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 8,
      marginRight: 10,
      backgroundColor: theme.primary + "33",
      borderWidth: 1,
      borderColor: theme.primary + "88",
    },

    settingButtonActive: {
      backgroundColor: theme.primary + "88",
    },

    settingButtonText: {
      fontWeight: "600",
      color: theme.text,
    },

    logoutContainer: {
      marginTop: 10,
      marginBottom: 25,
      width: "100%",
      alignItems: "center",
    },

    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      width: "100%",
      borderRadius: 10,
    },

    confirmOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    },

    confirmBox: {
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 14,
      width: "80%",
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.2,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 10,
    },

    confirmRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },

    confirmButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 5,
    },
  });
