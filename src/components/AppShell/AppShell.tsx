import { useThemeMode } from "@/Context/Theme/theme-store";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Button, useTheme } from "react-native-paper";
import { AppContainer } from "../reusable/AppContainer";
import { AppSurface } from "../reusable/AppSurface";
import { AppText } from "../reusable/AppText";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface NavItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

export interface BottomAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

export interface AppShellProps {
  children: React.ReactNode;
  /** Title shown in the top toolbar */
  title?: string;
  /** Logo element rendered in the toolbar (left side) */
  logo?: ImageSourcePropType;
  /** Items shown in the sidebar */
  navItems?: NavItem[];
  /** Currently active nav item key */
  activeNav?: string;
  /** Callback when a nav item is pressed */
  onNavPress?: (key: string) => void;
  /** Actions shown in the bottom bar */
  bottomActions?: BottomAction[];
  /** Right-side element in the toolbar (e.g. avatar/icon button) */
  toolbarRight?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SIDEBAR_WIDTH = 260;
const TOOLBAR_HEIGHT = 48;
const BOTTOM_BAR_HEIGHT = 52;
const SCREEN_BREAKPOINT = 768; // treat as "tablet / desktop" if wider

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "clients", label: "Clientes" },
  { key: "projects", label: "Proyectos" },
  { key: "reports", label: "Reportes" },
  { key: "settings", label: "Configuración" },
];

const DEFAULT_BOTTOM_ACTIONS: BottomAction[] = [
  { key: "add", label: "Agregar" },
  { key: "search", label: "Buscar" },
  { key: "notifications", label: "Alertas" },
];

// ---------------------------------------------------------------------------
// Simple icon primitives (no external dependency required)
// ---------------------------------------------------------------------------
const IconMenu = () => {
  const theme = useTheme();

  return (
    <View style={iconStyles.wrapper}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            iconStyles.bar,
            { backgroundColor: theme.colors.onSurfaceVariant },
          ]}
        />
      ))}
    </View>
  );
};

const IconClose = () => {
  const theme = useTheme();

  return (
    <View style={iconStyles.wrapper}>
      <View
        style={[
          iconStyles.bar,
          {
            backgroundColor: theme.colors.onSurfaceVariant,
            transform: [{ rotate: "45deg" }],
            marginBottom: -2,
          },
        ]}
      />
      <View
        style={[
          iconStyles.bar,
          {
            backgroundColor: theme.colors.onSurfaceVariant,
            transform: [{ rotate: "-45deg" }],
          },
        ]}
      />
    </View>
  );
};

interface IconChevronProps {
  open: boolean;
}

const IconChevron = ({ open }: IconChevronProps) => {
  const theme = useTheme();

  return (
    <View
      style={{
        width: 10,
        height: 10,
        borderRightWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: theme.colors.onSurfaceVariant,
        transform: [{ rotate: open ? "225deg" : "45deg" }],
        marginTop: open ? 3 : -1,
      }}
    />
  );
};

const IconPlus = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        width: 18,
        height: 18,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 14,
          height: 1.5,
          backgroundColor: theme.colors.onSurfaceVariant,
          position: "absolute",
        }}
      />
      <View
        style={{
          width: 1.5,
          height: 14,
          backgroundColor: theme.colors.onSurfaceVariant,
          position: "absolute",
        }}
      />
    </View>
  );
};

const IconSearch = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        width: 18,
        height: 18,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          borderWidth: 1.5,
          borderColor: theme.colors.onSurfaceVariant,
        }}
      />
      <View
        style={{
          width: 5,
          height: 1.5,
          backgroundColor: theme.colors.onSurfaceVariant,
          position: "absolute",
          bottom: 2,
          right: 2,
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
  );
};

const IconBell = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        width: 18,
        height: 18,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 12,
          height: 10,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          borderWidth: 1.5,
          borderColor: theme.colors.onSurfaceVariant,
          borderBottomWidth: 0,
        }}
      />
      <View
        style={{
          width: 14,
          height: 1.5,
          backgroundColor: theme.colors.onSurfaceVariant,
          marginTop: -1,
        }}
      />
      <View
        style={{
          width: 4,
          height: 2,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          backgroundColor: theme.colors.onSurfaceVariant,
        }}
      />
    </View>
  );
};

const BOTTOM_ICONS: Record<string, React.ReactNode> = {
  add: <IconPlus />,
  search: <IconSearch />,
  notifications: <IconBell />,
};

// ---------------------------------------------------------------------------
// Design tokens (vanilla / neutral)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SidebarProps {
  navItems: NavItem[];
  activeNav: string;
  onNavPress: (key: string) => void;
  logo?: ImageSourcePropType;
  style?: object;
  toggleTheme: () => void;
}

const Sidebar = ({
  navItems,
  activeNav,
  onNavPress,
  logo,
  style,
  toggleTheme,
}: SidebarProps) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.sidebar,
        { backgroundColor: theme.colors.surfaceVariant },
        style,
      ]}
    >
      <View style={styles.sidebarHeader}>
        <Image source={logo} style={styles.logoStyles} resizeMode="contain" />
      </View>

      <View
        style={[
          styles.sidebarDivider,
          { backgroundColor: theme.colors.outline },
        ]}
      />

      <ScrollView
        style={styles.sidebarScroll}
        showsVerticalScrollIndicator={false}
      >
        {navItems.map((item) => {
          const isActive = item.key === activeNav;

          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.navItem,
                isActive && {
                  backgroundColor: theme.colors.secondaryContainer,
                },
              ]}
              onPress={() => onNavPress(item.key)}
              activeOpacity={0.7}
            >
              {item.icon && <View style={styles.navIcon}>{item.icon}</View>}

              <AppText
                style={[
                  styles.navLabel,
                  {
                    color: isActive
                      ? theme.colors.onSecondaryContainer
                      : theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                {item.label}
              </AppText>

              {isActive && <IconChevron open={false} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View
        style={[
          styles.sidebarDivider,
          { backgroundColor: theme.colors.outline },
        ]}
      />

      <View
        style={[styles.sidebarFooter, { borderTopColor: theme.colors.outline }]}
      >
        <Button onPress={toggleTheme}>Cambiar tema</Button>

        <AppText
          style={[
            styles.sidebarFooterText,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          v1.0.0
        </AppText>
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Main AppShell
// ---------------------------------------------------------------------------
export default function AppShell({
  children,
  title = "Dashboard",
  logo,
  navItems = DEFAULT_NAV_ITEMS,
  activeNav: activeNavProp = "dashboard",
  onNavPress,
  bottomActions = DEFAULT_BOTTOM_ACTIONS,
  toolbarRight,
}: AppShellProps) {
  const theme = useTheme();

  const { toggleTheme } = useThemeMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(activeNavProp);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const { width } = useWindowDimensions();
  const isWide = width >= SCREEN_BREAKPOINT;

  // Sync prop changes
  useEffect(() => {
    setActiveNav(activeNavProp);
  }, [activeNavProp]);

  // Animate sidebar
  useEffect(() => {
    if (isWide) {
      // On wide screens sidebar is always visible, no animation needed
      slideAnim.setValue(0);
      overlayAnim.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: sidebarOpen ? 0 : -SIDEBAR_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: sidebarOpen ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [sidebarOpen, isWide]);

  const handleNavPress = (key: string) => {
    setActiveNav(key);
    onNavPress?.(key);
    if (!isWide) setSidebarOpen(false);
  };

  useEffect(() => {
    if (isWide) {
      setSidebarOpen(false);
    }
  }, [isWide]);

  const statusBarHeight =
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0;

  return (
    <AppContainer>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />

      {/* Toolbar */}
      <AppSurface
        elevation={2}
        style={[
          styles.toolbar,
          {
            paddingTop: statusBarHeight,
            height: TOOLBAR_HEIGHT + statusBarHeight,
            borderBottomColor: theme.colors.outline,
          },
        ]}
      >
        {!isWide && (
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? <IconClose /> : <IconMenu />}
          </TouchableOpacity>
        )}

        <AppText style={styles.toolbarTitle}>{title}</AppText>

        <View style={styles.toolbarRight}>
          {toolbarRight ?? (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <AppText style={styles.avatarInitial}>U</AppText>
            </View>
          )}
        </View>
      </AppSurface>

      {/* Body */}
      <View style={styles.body}>
        {isWide && (
          <Sidebar
            navItems={navItems}
            activeNav={activeNav}
            onNavPress={handleNavPress}
            logo={logo}
            toggleTheme={toggleTheme}
          />
        )}

        <View style={styles.content}>{children}</View>
      </View>

      {/* Bottom bar */}
      <AppSurface
        elevation={2}
        style={[styles.bottomBar, { borderTopColor: theme.colors.outline }]}
      >
        {bottomActions.map((action) => (
          <TouchableOpacity
            key={action.key}
            style={styles.bottomAction}
            onPress={action.onPress}
          >
            <View style={styles.bottomActionIcon}>
              {action.icon ?? BOTTOM_ICONS[action.key] ?? null}
            </View>

            <AppText style={styles.bottomActionLabel}>{action.label}</AppText>
          </TouchableOpacity>
        ))}
      </AppSurface>

      {/* Drawer mobile */}
      {!isWide && (
        <>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayAnim,
                backgroundColor: theme.colors.backdrop,
              },
            ]}
            pointerEvents={sidebarOpen ? "auto" : "none"}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setSidebarOpen(false)}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.drawerSidebar,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <Sidebar
              navItems={navItems}
              activeNav={activeNav}
              onNavPress={handleNavPress}
              logo={logo}
              toggleTheme={toggleTheme}
            />
          </Animated.View>
        </>
      )}
    </AppContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // Toolbar
  toolbar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 0,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },

  toolbarBtn: {
    width: 36,
    height: TOOLBAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },

  toolbarTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.1,
    paddingBottom: 12,
  },

  toolbarRight: {
    height: TOOLBAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 8,
  },

  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInitial: {
    fontSize: 12,
    fontWeight: "700",
  },

  // Body
  body: {
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
  },

  // Content
  content: {
    flex: 1,
  },

  // Sidebar
  sidebar: {
    width: SIDEBAR_WIDTH,
    flexDirection: "column",
    height: "100%",
  },

  sidebarHeader: {
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  logoStyles: {
    height: 70,
    width: "100%",
  },

  sidebarDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 0,
  },

  sidebarScroll: {
    flex: 1,
    paddingTop: 8,
  },

  sidebarFooter: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  sidebarFooterText: {
    fontSize: 11,
  },

  // Nav items
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginBottom: 2,
    borderRadius: 6,
  },

  navItemActive: {
    borderLeftWidth: 2,
  },

  navIcon: {
    marginRight: 10,
    width: 18,
    alignItems: "center",
  },

  navLabel: {
    flex: 1,
    fontSize: 14,
    letterSpacing: 0.1,
  },

  navLabelActive: {
    fontWeight: "600",
  },

  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logoMark: {
    width: 22,
    height: 22,
    borderRadius: 4,
  },

  logoText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Bottom bar
  bottomBar: {
    height: BOTTOM_BAR_HEIGHT,
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  bottomAction: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
    paddingBottom: 6,
  },

  bottomActionIcon: {
    marginBottom: 2,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomActionLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },

  drawerSidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 30,
    elevation: 10,
  },
});

const iconStyles = StyleSheet.create({
  wrapper: {
    width: 20,
    height: 14,
    justifyContent: "space-between",
  },

  bar: {
    width: 20,
    height: 2,
    borderRadius: 1,
  },
});
