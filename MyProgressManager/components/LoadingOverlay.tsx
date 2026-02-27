// components/LoadingOverlay.tsx
import { StyleSheet, ActivityIndicator } from "react-native";
import { BlurView } from "expo-blur";

export default function LoadingOverlay() {
  return (
    <BlurView intensity={19} tint="dark" style={styles.overlay}>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,  
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

