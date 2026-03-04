import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";

interface AppContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}

/**
 * LAYOUT DE PANTALLA, NO SE ENCARGA DE NADA ESPECIFICO
 * @param param0
 * @returns
 */
export function AppContainer({
  children,
  style,
  padded = false,
}: AppContainerProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.background,
          paddingHorizontal: padded ? 16 : 0,
          paddingVertical: padded ? 12 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
  },
});
