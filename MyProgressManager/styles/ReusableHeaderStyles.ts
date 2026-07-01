// styles/ReusableHeaderStyles.ts
import { StyleSheet } from "react-native";
import { scale, verticalScale, fontScale } from "../utils/responsive";

export const createReusableHeaderStyles = (theme: any) =>
  StyleSheet.create({
    headerContainer: {
      position: "absolute",
      opacity: 0.96,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      elevation: 6,
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(60),
      paddingBottom: verticalScale(6),
      backgroundColor: theme.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      shadowColor: theme.shadowcolor,
      shadowOffset: { width: 0, height: verticalScale(4) },
      shadowOpacity: 0.1,
      shadowRadius: scale(6),
    },

    headerRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    title: {
      fontSize: fontScale(58),
      fontWeight: "700",
      letterSpacing: -0.5,
      textAlign: "left",
      color: theme.text,
    },

    smallTitle: {
      fontSize: fontScale(20),
      fontWeight: "600",
      textAlign: "center",
      color: theme.text,
      position: "absolute",
      top: verticalScale(46),
      left: 0,
      right: 0,
    },
  });
