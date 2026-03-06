import { AuthProvider } from "@/auth/auth-store";
import { ThemeProvider, useThemeMode } from "@/Context/Theme/theme-store";
import "@/Tasks/real-time-location/locationTask";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";

function AppProviders() {
  const { theme } = useThemeMode();

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 15,
            refetchOnReconnect: true,
            refetchOnMount: "always",
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProviders />
      </ThemeProvider>
      <Toast autoHide position="bottom" />
    </QueryClientProvider>
  );
}
