import { useAuth } from "@/auth/auth-store";
import { Redirect, Slot } from "expo-router";

export default function AuthLayout() {
  const { token, loading } = useAuth();

  if (loading) return null;

  if (token) return <Redirect href="/dashboard" />;

  return <Slot />;
}
