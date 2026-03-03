import { useAuth } from "@/auth/auth-store";
import { Redirect, Slot } from "expo-router";

export default function AppLayout() {
  const { token, loading } = useAuth();

  if (loading) return null;

  if (!token) return <Redirect href="/login" />;

  return <Slot />;
}
