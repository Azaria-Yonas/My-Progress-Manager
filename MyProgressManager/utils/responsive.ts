import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

const shortSide = Math.min(width, height);
const longSide = Math.max(width, height);

export const scale = (size: number) =>
  Math.round((shortSide / BASE_WIDTH) * size);

export const verticalScale = (size: number) =>
  Math.round((longSide / BASE_HEIGHT) * size);

export const moderateScale = (size: number, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

export const fontScale = (size: number) => moderateScale(size, 0.3);
