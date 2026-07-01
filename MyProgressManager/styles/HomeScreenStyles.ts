import { StyleSheet } from "react-native";
import { scale, verticalScale, fontScale } from "../utils/responsive";

export const createHomeScreenStyles = (theme: any) =>
  StyleSheet.create({
    headerContainer: {
      position: "absolute",
      opacity: 0.96,
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.background,
      zIndex: 10,
      elevation: 6,
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(60),
      paddingBottom: verticalScale(6),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      shadowColor: theme.shadowcolor,
      shadowOffset: { width: 0, height: verticalScale(4) },
      shadowOpacity: 0.1,
      shadowRadius: scale(6),
    },

    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    title: {
      fontSize: fontScale(58),
      fontWeight: "700",
      letterSpacing: -0.5,
      textAlign: "left",
      color: theme.text,
    },

    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: scale(16),
    },

    item: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: verticalScale(12),
      paddingHorizontal: scale(16),
      borderRadius: scale(12),
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },

    itemText: {
      fontSize: fontScale(17),
      color: theme.text,
    },

    delete: {
      fontSize: fontScale(17),
      color: theme.danger,
    },

    addCircleButton: {
      width: scale(42),
      height: scale(42),
      borderRadius: scale(21),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.primary,
      shadowColor: theme.primary,
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: verticalScale(4) },
      shadowRadius: scale(10),
      elevation: 8,
    },

    addButtonText: {
      color: theme.onPrimary,
      fontSize: fontScale(26),
      lineHeight: fontScale(28),
      textAlign: "center",
    },
  });
