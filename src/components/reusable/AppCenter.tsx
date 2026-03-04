import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface AppCenterProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  horizontal?: boolean;
  vertical?: boolean;
}

/**
 * PARA CENTRAR ELEMENTOS Y RESPONSIVIDAD
 * @param param0
 * @returns
 */
export function AppCenter({
  children,
  style,
  horizontal = true,
  vertical = true,
}: AppCenterProps) {
  return (
    <View
      style={[
        styles.container,
        horizontal && styles.horizontal,
        vertical && styles.vertical,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  horizontal: {
    alignItems: "center",
  },
  vertical: {
    justifyContent: "center",
  },
});
