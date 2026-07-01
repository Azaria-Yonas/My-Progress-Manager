import { StyleSheet } from "react-native";
import { scale, verticalScale, fontScale } from "../utils/responsive";

export const createLoginSignupStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: scale(20),
      paddingBottom: verticalScale(30),
      paddingTop: verticalScale(50),
      justifyContent: "space-between",
      backgroundColor: "transparent",
    },

    logoBox: {
      marginTop: 0,
      width: "50%",
      height: "20%",
      borderRadius: scale(20),
      overflow: "hidden",
      backgroundColor: "transparent",
      marginBottom: verticalScale(30),
    },

    logoImage: {
      width: "100%",
      height: "100%",
    },

    welcomeBox: {
      width: "95%",
      flex: 1,
      borderRadius: scale(24),
      alignSelf: "center",
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: verticalScale(2) },
      shadowRadius: scale(10),
      elevation: 4,
    },

    welcomeInner: {
      flex: 1,
      borderRadius: scale(24),
      padding: scale(20),
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },

    welcomeScroll: {
      flexGrow: 0,
    },

    welcomeText: {
      fontSize: fontScale(28),
      fontWeight: "700",
      marginBottom: verticalScale(10),
      textAlign: "center",
      color: theme.text,
    },

    introText: {
      fontSize: fontScale(14),
      fontFamily: "RobotoThin",
      lineHeight: fontScale(20),
      textAlign: "justify",
      color: theme.textMuted,
    },

    getStartedButton: {
      paddingVertical: verticalScale(15),
      paddingHorizontal: scale(40),
      borderRadius: scale(30),
      marginTop: verticalScale(30),
      marginBottom: verticalScale(20),
      backgroundColor: theme.primary,
      shadowColor: theme.primary,
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: verticalScale(6) },
      shadowRadius: scale(12),
      elevation: 8,
    },

    getStartedButtonText: {
      fontSize: fontScale(18),
      fontWeight: "600",
      color: theme.onPrimary,
      textAlign: "center",
    },
  });
