import { useAuth } from "@/auth/auth-store";
import { Redirect } from "expo-router";

export default function HomeScreen() {
  const { token, loading } = useAuth();

  if (loading) return null;
  if (!token) return <Redirect href="/login" />;

  return <Redirect href="/dashboard" />;
}

// return (
// <ThemedView style={styles.container}>
//   <SafeAreaView style={styles.safeArea}>
//     <ThemedView style={styles.heroSection}>
//       <AnimatedIcon />
//       <ThemedText type="title" style={styles.title}>
//         NUEVA PLANTILLA
//       </ThemedText>
//     </ThemedView>

//     <ThemedText type="code" style={styles.code}>
//       get started
//     </ThemedText>

//     <ThemedView type="backgroundElement" style={styles.stepContainer}>
//       <HintRow
//         title="Try editing"
//         hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
//       />
//       <HintRow title="Dev tools" hint={getDevMenuHint()} />
//       <HintRow
//         title="Fresh start"
//         hint={<ThemedText type="code">npm run reset-project</ThemedText>}
//       />
//     </ThemedView>

//     {Platform.OS === "web" && <WebBadge />}
//   </SafeAreaView>
// </ThemedView>

// );
