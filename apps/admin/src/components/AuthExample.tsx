import { useAuth } from "@/contexts/AuthContext";

export function AuthExample() {
  const auth = useAuth();

  return (
    <section className="page-card stack">
      <div className="page-header">
        <div>
          <h2>Auth Example</h2>
          <p className="muted">Supabase auth state exposed through context.</p>
        </div>
        <span className="pill">{auth.status}</span>
      </div>
      <pre>{JSON.stringify(auth.user, null, 2)}</pre>
    </section>
  );
}
