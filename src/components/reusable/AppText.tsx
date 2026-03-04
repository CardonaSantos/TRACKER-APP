import React, { ReactNode } from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { useTheme } from "react-native-paper";

interface AppTextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}
/**
 * Para tipografia consistente con el theme
 * @param param0
 * @returns
 */
export function AppText({ children, style }: AppTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        {
          color: theme.colors.onBackground,
          fontSize: 14,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
