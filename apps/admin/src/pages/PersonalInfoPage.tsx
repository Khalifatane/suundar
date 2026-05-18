import { useAuth } from "@/contexts/AuthContext";
import { PlaceholderPage } from "./_helpers";
export function PersonalInfoPage() {
  const auth = useAuth();
  return (
    <PlaceholderPage title="Personal Info" description="Profile route consuming shared auth context.">
      <pre>{JSON.stringify(auth.user, null, 2)}</pre>
    </PlaceholderPage>
  );
}
