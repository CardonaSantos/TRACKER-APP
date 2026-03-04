import React, { ReactNode } from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { useTheme } from "react-native-paper";

interface AppTextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

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
