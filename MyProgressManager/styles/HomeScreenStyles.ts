import { StyleSheet } from "react-native";

export const createHomeScreenStyles = (theme: any) =>
  StyleSheet.create({
    headerContainer: {
      position: "absolute",
      opacity: 0.93,
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.background, 
      zIndex: 10,
      elevation: 6,
      paddingHorizontal: 10,
      paddingTop: 60,
      paddingBottom: 1,
      shadowColor: theme.shadowcolor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },

    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    title: {
      fontSize: 62,
      fontWeight: "bold",
      textAlign: "left",
      color: theme.text, 
    },

    container: {
      flex: 1,
      backgroundColor: theme.background, 
      paddingHorizontal: 15,
    },

    item: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 2,
      paddingHorizontal: 150,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#ccc",
    },

    itemText: {
      fontSize: 20,
      color: theme.text, 
    },

    delete: {
      fontSize: 20,
      color: theme.danger, 
    },

    addCircleButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.primary + "87",  

      shadowColor: theme.primary,
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 10,
      overflow: "hidden",
      opacity: 0.97,

    },

    addButtonText: {
      color: theme.text, 
      fontSize: 28,
      lineHeight: 28,
      textAlign: "center",
    },
  });
