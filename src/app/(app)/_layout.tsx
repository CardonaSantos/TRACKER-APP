import logoEmpresa from "@/assets/log/logopngapk.png";
import { useAuth } from "@/auth/auth-store";
import AppShell, {
  BottomAction,
  NavItem,
} from "@/components/AppShell/AppShell";
import { Redirect, Slot, usePathname, useRouter } from "expo-router";
// C:\Users\Saint's M\Desktop\EXPO APP\tracker-crm\assets\log\logopngapk.png
export default function AppLayout() {
  const NAV_ITEMS: NavItem[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "maps", label: "Mapas" }, // Cambiado de 'maps' a 'maps'
    { key: "perfil", label: "Perfil" }, // Cambiado de 'settings' a 'perfil'
  ];

  const ROUTE_MAP: Record<string, string> = {
    dashboard: "/dashboard", // Quitamos (app) para comparar más fácil
    maps: "/maps",
    perfil: "/perfil",
  };

  const BOTTOM_ACTIONS: BottomAction[] = [
    { key: "add", label: "Agregar" },
    { key: "search", label: "Buscar" },
    { key: "notifications", label: "Alertas" },
  ];

  const { token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) return null;
  if (!token) return <Redirect href="/(auth)/login" />;

  // Derive active nav key from current route
  const activeNav =
    Object.entries(ROUTE_MAP).find(([, route]) =>
      // pathname.startsWith(route.replace("/(app)/", "/")),
      pathname.startsWith(route),
    )?.[0] ?? "dashboard";

  const handleNavPress = (key: string) => {
    const route = ROUTE_MAP[key];
    if (route) router.push(route as never);
  };

  const handleBottomAction = (key: string) => {
    // Wire up your quick actions here
    console.log("bottom action:", key);
  };

  return (
    <AppShell
      logo={logoEmpresa}
      title={NAV_ITEMS.find((i) => i.key === activeNav)?.label ?? "App"}
      navItems={NAV_ITEMS}
      activeNav={activeNav}
      onNavPress={handleNavPress}
      bottomActions={BOTTOM_ACTIONS.map((a) => ({
        ...a,
        onPress: () => handleBottomAction(a.key),
      }))}
    >
      {/* Renderizado de childrens */}
      <Slot />
    </AppShell>
  );
}
