import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Surface } from "react-native-paper";
import { ElevationLevels } from "react-native-paper/lib/typescript/types";

interface AppSurfaceProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: ElevationLevels; // De que tipo es? ENUM
}
/**
 * para tarjetas o bloques visuales, con sombra o elevacion
 * @param param0
 * @returns
 */
export function AppSurface({ children, style, elevation }: AppSurfaceProps) {
  return (
    <Surface elevation={elevation} style={[styles.surface, style]}>
      {children}
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    width: "100%",
  },
});
