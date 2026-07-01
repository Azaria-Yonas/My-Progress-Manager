// styles/ProfileStyles.ts
import { StyleSheet } from "react-native";
import { scale, verticalScale } from "../utils/responsive";

export const createProfileStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: verticalScale(60),
    },

    scrollContent: {
      paddingHorizontal: scale(20),
      paddingBottom: verticalScale(80),
      paddingTop: verticalScale(130),
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },

    card: {
      padding: scale(20),
      borderRadius: scale(16),
      marginTop: verticalScale(20),
      marginBottom: verticalScale(25),
      backgroundColor: theme.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.08,
      shadowRadius: scale(6),
      shadowOffset: { width: 0, height: verticalScale(2) },
      elevation: 4,
    },

    sectionTitle: {
      marginBottom: verticalScale(12),
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: verticalScale(10),
    },

    settingButton: {
      paddingVertical: verticalScale(10),
      paddingHorizontal: scale(18),
      borderRadius: scale(8),
      marginRight: scale(10),
      backgroundColor: theme.primary + "1F",
      borderWidth: 1,
      borderColor: theme.primary + "66",
    },

    settingButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },

    settingButtonText: {
      fontWeight: "600",
      color: theme.text,
    },

    settingButtonTextActive: {
      color: theme.onPrimary,
    },

    logoutContainer: {
      marginTop: verticalScale(10),
      marginBottom: verticalScale(25),
      width: "100%",
      alignItems: "center",
    },

    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: verticalScale(14),
      width: "100%",
      borderRadius: scale(10),
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
      padding: scale(20),
      borderRadius: scale(14),
      width: "80%",
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.2,
      shadowRadius: scale(10),
      shadowOffset: { width: 0, height: verticalScale(4) },
      elevation: 10,
    },

    confirmRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: verticalScale(10),
    },

    confirmButton: {
      flex: 1,
      paddingVertical: verticalScale(10),
      borderRadius: scale(8),
      alignItems: "center",
      marginHorizontal: scale(5),
    },
  });
