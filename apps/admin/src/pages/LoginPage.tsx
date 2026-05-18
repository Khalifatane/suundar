import { useAuth } from "@/contexts/AuthContext";
import { PlaceholderPage } from "./_helpers";
export function LoginPage() {
  const auth = useAuth();
  return <PlaceholderPage title="Login" description={`Current auth status: ${auth.status}.`} />;
}
