import { useAuthStore } from "@/auth/auth-store";
import { useEffect, useState } from "react";

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    setHydrated(useAuthStore.persist.hasHydrated());

    return () => unsub();
  }, []);

  return hydrated;
}
