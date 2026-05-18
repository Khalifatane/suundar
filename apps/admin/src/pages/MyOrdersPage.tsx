import { useOverviewMetrics } from "@/hooks";
import { PlaceholderPage } from "./_helpers";
export function MyOrdersPage() {
  const { data, loading } = useOverviewMetrics();
  return (
    <PlaceholderPage title="My Orders" description="Order history route scaffold using shared Supabase data.">
      <p className="muted">{loading ? "Loading order snapshot..." : `Recent order count: ${data?.recentOrders.length ?? 0}`}</p>
    </PlaceholderPage>
  );
}
