import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const brand = {
  primary: "#27C3A3",
  primaryDark: "#1EA88D",

  dark: "#0B0B0C",

  gray900: "#0F1115",
  gray800: "#1B1F24",
  gray700: "#2A3038",
  gray500: "#6B7280",
  gray300: "#D1D5DB",
  gray100: "#F3F4F6",
  white: "#FFFFFF",
};
export const lightTheme = {
  ...MD3LightTheme,
  dark: false,

  colors: {
    ...MD3LightTheme.colors,

    primary: brand.primary,

    background: "#F7F9FA",
    surface: "#FFFFFF",
    surfaceVariant: "#F2F4F6",

    outline: "#E4E7EC",

    onSurface: "#111827",
    onSurfaceVariant: "#6B7280",

    secondaryContainer: "#E6FBF7",
    onSecondaryContainer: "#065F52",
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  dark: true,

  colors: {
    ...MD3DarkTheme.colors,

    primary: brand.primary,

    background: "#0F1115",
    surface: "#15181D",
    surfaceVariant: "#1C2026",

    outline: "#2A3038",

    onSurface: "#F3F4F6",
    onSurfaceVariant: "#9CA3AF",

    secondaryContainer: "#133A33",
    onSecondaryContainer: "#8FF5E0",
  },
};
