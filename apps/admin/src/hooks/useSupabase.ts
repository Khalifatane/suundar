import { useEffect, useMemo, useState } from "react";
import { resolveAuthState, onAuthStateChange } from "@siggistore/auth";
import { getOverviewMetrics } from "@siggistore/supabase/admin";
import type { UnifiedAuthState } from "@siggistore/shared-types";

function normalizeAuthStatus(status: unknown): UnifiedAuthState["status"] {
  if (
    status === "authenticated" ||
    status === "signed_out" ||
    status === "forbidden" ||
    status === "loading"
  ) {
    return status;
  }

  return "signed_out";
}

export function useSupabaseAuth() {
  const [authState, setAuthState] = useState<UnifiedAuthState>({
    user: null,
    session: null,
    status: "loading",
  });

  useEffect(() => {
    let active = true;

    resolveAuthState()
      .then((state) => {
        if (!active) return;
        setAuthState({
          user: state.user,
          session: state.session,
          status: normalizeAuthStatus(state.status),
        });
      })
      .catch(() => {
        if (!active) return;
        setAuthState({
          user: null,
          session: null,
          status: "signed_out",
        });
      });

    const unsubscribe = onAuthStateChange((state) => {
      if (!active) return;
      setAuthState({
        user: state.user,
        session: state.session,
        status: normalizeAuthStatus(state.status),
      });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return authState;
}

export function useOverviewMetrics() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getOverviewMetrics>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverviewMetrics()
      .then((value) => setData(value))
      .finally(() => setLoading(false));
  }, []);

  return useMemo(() => ({ data, loading }), [data, loading]);
}
