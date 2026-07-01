// MyProgressManager/constants/Colors.ts

const iconLightBlue = "#5E8AD6";
const iconIndigo = "#5A5FD0";
const iconTeal = "#69B3DE";

export const LightColors = {
  primary: iconLightBlue,
  primaryPressed: "#4C78C6",
  primarySoft: iconLightBlue,
  accent: iconTeal,
  onPrimary: "#FFFFFF",

  background: "#F1F4FA",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  input: "#E8EEF7",
  border: "#D6DFEC",

  text: "#191E28",
  textMuted: "#586576",

  success: "#2FA36B",
  danger: "#D6474B",
  shadowcolor: "#1A2333",
};

export const DarkColors = {
  primary: iconIndigo,
  primaryPressed: "#4A50BE",
  primarySoft: iconIndigo,
  accent: iconTeal,
  onPrimary: "#FFFFFF",

  background: "#14141E",
  surface: "#1E1E2B",
  card: "#1E1E2B",
  input: "#272733",
  border: "#333346",

  text: "#EEEFF6",
  textMuted: "#A1A2B4",

  success: "#37B577",
  danger: "#E0575B",
  shadowcolor: "#000000",
};

export const Colors = {
  light: LightColors,
  dark: DarkColors,
};

export function getContrastTextColor(backgroundColor: string): string {
  try {
    const hex = backgroundColor.replace("#", "");
    if (hex.length !== 3 && hex.length !== 6) {
      return "#000000";
    }

    const r = parseInt(
      hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2),
      16,
    );
    const g = parseInt(
      hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4),
      16,
    );
    const b = parseInt(
      hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6),
      16,
    );

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    return luminance > 186 ? "#000000" : "#FFFFFF";
  } catch {
    return "#000000";
  }
}
