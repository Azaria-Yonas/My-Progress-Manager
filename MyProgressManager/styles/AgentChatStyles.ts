import { StyleSheet, Dimensions } from "react-native";
import { scale, verticalScale, fontScale } from "../utils/responsive";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const AGENT_PANEL_HEIGHT = Math.round(SCREEN_HEIGHT * 0.86);
export const AGENT_FAB_REST_TOP = verticalScale(104);
export const AGENT_FAB_SHIFT = verticalScale(34);

export const AGENT_FAB_SIZE = scale(46);
export const AGENT_FAB_MARGIN = scale(16);

const BOTTOM_BAR_CLEARANCE =
  verticalScale(30) + verticalScale(24) + scale(26) + verticalScale(12);

export const AGENT_FAB_LEFT_X = AGENT_FAB_MARGIN;
export const AGENT_FAB_RIGHT_X = SCREEN_WIDTH - AGENT_FAB_MARGIN - AGENT_FAB_SIZE;
export const AGENT_FAB_MAX_X = SCREEN_WIDTH - AGENT_FAB_SIZE;
export const AGENT_FAB_MIN_Y = verticalScale(58);
export const AGENT_FAB_MAX_Y = Math.max(
  AGENT_FAB_MIN_Y,
  SCREEN_HEIGHT - BOTTOM_BAR_CLEARANCE - AGENT_FAB_SIZE
);

export interface AgentFabPosition {
  x: number;
  y: number;
}

export const AGENT_FAB_DEFAULT_POSITION: AgentFabPosition = {
  x: AGENT_FAB_RIGHT_X,
  y: AGENT_FAB_REST_TOP,
};

export interface AgentFabBounds {
  leftX: number;
  rightX: number;
  maxX: number;
  minY: number;
  maxY: number;
  defaultPosition: AgentFabPosition;
}

// SCREEN_WIDTH/SCREEN_HEIGHT above are captured once at module load and never
// update on rotation, so the fab's right-edge/bottom bounds go stale after a
// device rotates (e.g. iPad landscape). Compute bounds from the current
// window size instead of relying on those stale constants.
export function computeAgentFabBounds(width: number, height: number): AgentFabBounds {
  const leftX = AGENT_FAB_MARGIN;
  const rightX = width - AGENT_FAB_MARGIN - AGENT_FAB_SIZE;
  const maxX = width - AGENT_FAB_SIZE;
  const minY = AGENT_FAB_MIN_Y;
  const maxY = Math.max(minY, height - BOTTOM_BAR_CLEARANCE - AGENT_FAB_SIZE);

  return {
    leftX,
    rightX,
    maxX,
    minY,
    maxY,
    defaultPosition: { x: rightX, y: AGENT_FAB_REST_TOP },
  };
}

export function clampFabValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function snapFabPosition(
  x: number,
  y: number,
  bounds: AgentFabBounds = {
    leftX: AGENT_FAB_LEFT_X,
    rightX: AGENT_FAB_RIGHT_X,
    maxX: AGENT_FAB_MAX_X,
    minY: AGENT_FAB_MIN_Y,
    maxY: AGENT_FAB_MAX_Y,
    defaultPosition: AGENT_FAB_DEFAULT_POSITION,
  }
): AgentFabPosition {
  const center = x + AGENT_FAB_SIZE / 2;
  const screenWidth = bounds.maxX + AGENT_FAB_SIZE;
  return {
    x: center < screenWidth / 2 ? bounds.leftX : bounds.rightX,
    y: clampFabValue(y, bounds.minY, bounds.maxY),
  };
}

export const createAgentChatStyles = (theme: any) =>
  StyleSheet.create({
    fabWrapper: {
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: 11,
    },

    fab: {
      width: AGENT_FAB_SIZE,
      height: AGENT_FAB_SIZE,
      borderRadius: AGENT_FAB_SIZE / 2,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      backgroundColor: theme.primary,
      shadowColor: theme.primary,
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: verticalScale(4) },
      shadowRadius: scale(10),
      elevation: 8,
    },

    fabGradient: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "center",
    },

    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.45)",
    },

    panel: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: AGENT_PANEL_HEIGHT,
      backgroundColor: theme.background,
      borderTopLeftRadius: scale(24),
      borderTopRightRadius: scale(24),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      shadowColor: theme.shadowcolor,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: -verticalScale(6) },
      shadowRadius: scale(16),
      elevation: 24,
      overflow: "hidden",
    },

    grabber: {
      alignSelf: "center",
      width: scale(42),
      height: verticalScale(5),
      borderRadius: scale(3),
      backgroundColor: theme.border,
      marginTop: verticalScale(10),
      marginBottom: verticalScale(8),
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: scale(18),
      paddingBottom: verticalScale(12),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },

    headerAvatar: {
      width: scale(38),
      height: scale(38),
      borderRadius: scale(19),
      alignItems: "center",
      justifyContent: "center",
      marginRight: scale(12),
      overflow: "hidden",
      backgroundColor: theme.primary,
    },

    avatarGradient: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "center",
    },

    avatarImage: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: "100%",
    },

    headerTextWrap: {
      flex: 1,
    },

    headerTitle: {
      fontSize: fontScale(18),
      fontWeight: "700",
      color: theme.text,
    },

    headerSubtitle: {
      fontSize: fontScale(12.5),
      color: theme.textMuted,
      marginTop: verticalScale(1),
    },

    headerClose: {
      width: scale(34),
      height: scale(34),
      borderRadius: scale(17),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.input,
    },

    listContent: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(16),
      paddingBottom: verticalScale(14),
      flexGrow: 1,
    },

    row: {
      width: "100%",
      marginVertical: verticalScale(5),
    },

    userRow: {
      alignItems: "flex-end",
    },

    assistantRow: {
      alignItems: "flex-start",
    },

    bubble: {
      maxWidth: "84%",
      paddingHorizontal: scale(14),
      paddingVertical: verticalScale(10),
      borderRadius: scale(20),
    },

    userBubble: {
      backgroundColor: theme.primary,
      borderBottomRightRadius: scale(6),
    },

    assistantBubble: {
      backgroundColor: theme.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      borderBottomLeftRadius: scale(6),
    },

    errorBubble: {
      backgroundColor: theme.danger + "1A",
      borderColor: theme.danger + "55",
    },

    userText: {
      color: theme.onPrimary,
    },

    assistantText: {
      color: theme.text,
    },

    errorText: {
      color: theme.danger,
    },

    typingBubble: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: theme.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      borderRadius: scale(20),
      borderBottomLeftRadius: scale(6),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(13),
    },

    typingDot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
      backgroundColor: theme.textMuted,
      marginHorizontal: scale(3),
    },

    emptyWrap: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: scale(28),
      paddingVertical: verticalScale(36),
    },

    emptyAvatar: {
      width: scale(68),
      height: scale(68),
      borderRadius: scale(34),
      alignItems: "center",
      justifyContent: "center",
      marginBottom: verticalScale(18),
      overflow: "hidden",
      backgroundColor: theme.primary,
      shadowColor: theme.primary,
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: verticalScale(6) },
      shadowRadius: scale(14),
      elevation: 8,
    },

    emptyTitle: {
      fontSize: fontScale(21),
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
      marginBottom: verticalScale(8),
    },

    emptySubtitle: {
      fontSize: fontScale(14.5),
      color: theme.textMuted,
      textAlign: "center",
      lineHeight: fontScale(21),
    },

    chipsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: verticalScale(24),
    },

    chip: {
      paddingHorizontal: scale(14),
      paddingVertical: verticalScale(9),
      borderRadius: scale(18),
      backgroundColor: theme.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      margin: scale(5),
    },

    chipText: {
      color: theme.text,
    },

    inputBar: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: scale(14),
      paddingTop: verticalScale(10),
      paddingBottom: verticalScale(22),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.border,
      backgroundColor: theme.background,
    },

    input: {
      flex: 1,
      minHeight: verticalScale(44),
      maxHeight: verticalScale(120),
      backgroundColor: theme.input,
      borderRadius: scale(22),
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(11),
      paddingBottom: verticalScale(11),
      color: theme.text,
      marginRight: scale(10),
    },

    sendButton: {
      width: scale(44),
      height: scale(44),
      borderRadius: scale(22),
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      backgroundColor: theme.primary,
    },

    sendGradient: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "center",
    },

    sendDisabled: {
      opacity: 0.45,
    },
  });
