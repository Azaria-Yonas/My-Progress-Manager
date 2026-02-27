// styles/ReusableHeaderStyles.ts
import { StyleSheet } from "react-native";

export const createReusableHeaderStyles = (theme: any) =>
  StyleSheet.create({
    headerContainer: {
      position: "absolute",
      opacity: 0.93,  
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      elevation: 6,
      paddingHorizontal: 10,
      paddingTop: 60,
      paddingBottom: 1,
      backgroundColor: theme.background,
      shadowColor: theme.shadowcolor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12, 
      shadowRadius: 6,
    },


    headerRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    title: {
      fontSize: 62, 
      fontWeight: "bold",
      textAlign: "left",
      color: theme.text,
    },

    smallTitle: {
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      color: theme.text,
      position: "absolute",
      top: 45,
      left: 0,
      right: 0,
    },
  });
