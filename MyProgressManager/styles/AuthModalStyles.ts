import { StyleSheet } from "react-native";
import { scale, verticalScale, fontScale } from "../utils/responsive";

export const createAuthModalStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "#00000088",
      justifyContent: "center",
      padding: scale(20),
    },

    box: {
      borderRadius: scale(20),
      padding: scale(28),
      backgroundColor: theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.18,
      shadowRadius: scale(14),
      shadowOffset: { width: 0, height: verticalScale(6) },
      elevation: 10,
    },

    title: {
      fontSize: fontScale(26),
      fontWeight: "700",
      marginBottom: verticalScale(20),
      textAlign: "center",
      color: theme.text,
    },

    input: {
      padding: scale(12),
      borderRadius: scale(10),
      marginBottom: verticalScale(12),
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      color: theme.text,
    },

    button: {
      padding: scale(14),
      borderRadius: scale(10),
      marginVertical: verticalScale(10),
      backgroundColor: theme.primary,
    },

    buttonText: {
      color: theme.onPrimary,
      fontWeight: "600",
      textAlign: "center",
    },

    link: {
      textAlign: "center",
      marginTop: verticalScale(10),
      fontSize: fontScale(14),
      color: theme.primary,
    },

    closeText: {
      marginTop: verticalScale(20),
      textAlign: "center",
      color: theme.textMuted,
    },
  });
