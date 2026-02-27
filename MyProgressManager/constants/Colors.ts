// MyProgressManager/constants/Colors.ts

export const LightColors = {
  primary: "#6A9BB8",
  background: "#ffffffff",
  text: "#212121",
  success: "#2ecc71",
  danger: "#e74c3c",




  
};

export const DarkColors = {
  primary: "#8B6CA8",
  background: "#606060ff",
  text: "#FFFFFF",
  success: "#2ecc71",
  danger: "#e74c3c",

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

