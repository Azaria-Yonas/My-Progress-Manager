// styles/AgentSetupStyles.ts
import { StyleSheet, Dimensions } from "react-native";
import { scale, verticalScale, fontScale } from "../utils/responsive";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const AGENT_SETUP_CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.92, scale(430));
export const AGENT_SETUP_CARD_MAX_HEIGHT = Math.round(SCREEN_HEIGHT * 0.86);

const CARD_PADDING = scale(20);
const GRID_GAP = scale(10);

export const AGENT_AVATAR_TILE = Math.floor(
  (AGENT_SETUP_CARD_WIDTH - CARD_PADDING * 2 - GRID_GAP * 2) / 3
);

export const AGENT_AVATAR_GRID_HEIGHT =
  AGENT_AVATAR_TILE * 2 + GRID_GAP * 2 + verticalScale(12);

export const createAgentSetupStyles = (theme: any) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.55)",
    },

    centerWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: verticalScale(24),
    },

    card: {
      width: AGENT_SETUP_CARD_WIDTH,
      maxHeight: AGENT_SETUP_CARD_MAX_HEIGHT,
      borderRadius: scale(26),
      backgroundColor: theme.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: verticalScale(10) },
      shadowRadius: scale(22),
      elevation: 24,
      overflow: "hidden",
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: CARD_PADDING,
      paddingTop: verticalScale(18),
      paddingBottom: verticalScale(12),
    },

    headerTextWrap: {
      flex: 1,
      paddingRight: scale(10),
    },

    eyebrow: {
      fontSize: fontScale(11.5),
      letterSpacing: 1.1,
      textTransform: "uppercase",
      color: theme.primary,
      fontWeight: "700",
    },

    headerTitle: {
      fontSize: fontScale(19),
      fontWeight: "700",
      color: theme.text,
      marginTop: verticalScale(3),
    },

    closeButton: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(16),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.input,
    },

    progressTrack: {
      height: verticalScale(4),
      marginHorizontal: CARD_PADDING,
      borderRadius: scale(3),
      backgroundColor: theme.border,
      overflow: "hidden",
    },

    progressFill: {
      height: "100%",
      borderRadius: scale(3),
      backgroundColor: theme.primary,
    },

    body: {
      paddingHorizontal: CARD_PADDING,
      paddingTop: verticalScale(20),
      paddingBottom: verticalScale(6),
    },

    stepWrap: {
      width: "100%",
    },

    avatarBlock: {
      alignItems: "center",
    },

    avatarButton: {
      width: scale(104),
      height: scale(104),
      borderRadius: scale(52),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.input,
      borderWidth: scale(2),
      borderColor: theme.border,
    },

    avatarButtonFilled: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + "1A",
    },

    avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: scale(52),
    },

    avatarEditBadge: {
      position: "absolute",
      right: -scale(2),
      bottom: -scale(2),
      width: scale(34),
      height: scale(34),
      borderRadius: scale(17),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
      borderWidth: scale(3),
      borderColor: theme.card,
    },

    avatarCaption: {
      fontSize: fontScale(14.5),
      fontWeight: "600",
      color: theme.primary,
      marginTop: verticalScale(14),
    },

    avatarHint: {
      fontSize: fontScale(12.5),
      color: theme.textMuted,
      marginTop: verticalScale(4),
      textAlign: "center",
    },

    grid: {
      overflow: "hidden",
      width: "100%",
    },

    gridInner: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingTop: verticalScale(12),
    },

    gridTile: {
      width: AGENT_AVATAR_TILE,
      height: AGENT_AVATAR_TILE,
      borderRadius: AGENT_AVATAR_TILE / 2,
      marginBottom: GRID_GAP,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.input,
      borderWidth: scale(2),
      borderColor: "transparent",
      overflow: "hidden",
    },

    gridTileSelected: {
      borderColor: theme.primary,
    },

    gridTileImage: {
      width: "100%",
      height: "100%",
    },

    gridCheck: {
      position: "absolute",
      right: scale(2),
      bottom: scale(2),
      width: scale(22),
      height: scale(22),
      borderRadius: scale(11),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
      borderWidth: scale(2),
      borderColor: theme.card,
    },

    nameBlock: {
      marginTop: verticalScale(18),
    },

    fieldLabel: {
      fontSize: fontScale(15),
      fontWeight: "700",
      color: theme.text,
      marginBottom: verticalScale(6),
    },

    fieldHelper: {
      fontSize: fontScale(12.5),
      color: theme.textMuted,
      marginBottom: verticalScale(12),
      lineHeight: fontScale(18),
    },

    questionCounter: {
      fontSize: fontScale(12),
      fontWeight: "700",
      letterSpacing: 0.8,
      color: theme.textMuted,
      marginBottom: verticalScale(8),
    },

    questionPrompt: {
      fontSize: fontScale(20),
      fontWeight: "700",
      color: theme.text,
      lineHeight: fontScale(27),
      marginBottom: verticalScale(6),
    },

    input: {
      minHeight: verticalScale(48),
      backgroundColor: theme.input,
      borderRadius: scale(14),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      paddingHorizontal: scale(14),
      paddingTop: verticalScale(13),
      paddingBottom: verticalScale(13),
      color: theme.text,
      fontSize: fontScale(15),
    },

    inputMultiline: {
      minHeight: verticalScale(88),
      textAlignVertical: "top",
    },

    inputFocused: {
      borderColor: theme.primary,
    },

    chipsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: verticalScale(14),
      marginHorizontal: -scale(4),
    },

    chip: {
      paddingHorizontal: scale(13),
      paddingVertical: verticalScale(8),
      borderRadius: scale(18),
      backgroundColor: theme.primary + "14",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.primary + "4D",
      margin: scale(4),
    },

    chipSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },

    chipText: {
      fontSize: fontScale(13),
      fontWeight: "600",
      color: theme.text,
    },

    chipTextSelected: {
      color: theme.onPrimary,
    },

    summaryHeader: {
      alignItems: "center",
      marginBottom: verticalScale(18),
    },

    summaryAvatar: {
      width: scale(88),
      height: scale(88),
      borderRadius: scale(44),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.input,
      borderWidth: scale(2),
      borderColor: theme.primary,
      overflow: "hidden",
    },

    summaryName: {
      fontSize: fontScale(21),
      fontWeight: "700",
      color: theme.text,
      marginTop: verticalScale(12),
    },

    summarySubtitle: {
      fontSize: fontScale(13),
      color: theme.textMuted,
      marginTop: verticalScale(4),
      textAlign: "center",
      lineHeight: fontScale(19),
    },

    summaryRow: {
      paddingVertical: verticalScale(10),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.border,
    },

    summaryQuestion: {
      fontSize: fontScale(12.5),
      color: theme.textMuted,
      marginBottom: verticalScale(3),
    },

    summaryAnswer: {
      fontSize: fontScale(14.5),
      color: theme.text,
      lineHeight: fontScale(20),
    },

    summaryEmpty: {
      fontSize: fontScale(13.5),
      color: theme.textMuted,
      textAlign: "center",
      lineHeight: fontScale(20),
      paddingVertical: verticalScale(10),
    },

    errorText: {
      fontSize: fontScale(13),
      color: theme.danger,
      marginTop: verticalScale(12),
      textAlign: "center",
      lineHeight: fontScale(19),
    },

    footer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: CARD_PADDING,
      paddingTop: verticalScale(12),
      paddingBottom: verticalScale(10),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.border,
    },

    backButton: {
      width: scale(46),
      height: scale(46),
      borderRadius: scale(14),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.input,
      marginRight: scale(10),
    },

    nextButton: {
      flex: 1,
      flexDirection: "row",
      height: scale(46),
      borderRadius: scale(14),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },

    nextButtonDisabled: {
      opacity: 0.45,
    },

    nextButtonText: {
      fontSize: fontScale(15.5),
      fontWeight: "700",
      color: theme.onPrimary,
      marginRight: scale(6),
    },

    skipRow: {
      alignItems: "center",
      paddingBottom: verticalScale(16),
    },

    skipText: {
      fontSize: fontScale(13),
      fontWeight: "600",
      color: theme.textMuted,
    },
  });
