import { AuthExample } from "@/components/AuthExample";
import { IntegrationExample } from "@/components/IntegrationExample";
import { useOverviewMetrics } from "@/hooks";
import { formatMoney } from "@/lib/utils";
import { PlaceholderPage } from "./_helpers";

export function HomePage() {
  const { data, loading } = useOverviewMetrics();

  return (
    <PlaceholderPage
      title="Dashboard Home"
      description="Typed SPA overview backed by the shared service layer."
    >
      <div className="page-grid">
        <article className="stat-card">
          <div className="muted">Revenue</div>
          <strong>{loading ? "Loading..." : formatMoney(data?.metrics.revenue ?? 0)}</strong>
        </article>
        <article className="stat-card">
          <div className="muted">Orders</div>
          <strong>{loading ? "Loading..." : data?.metrics.orders ?? 0}</strong>
        </article>
        <article className="stat-card">
          <div className="muted">Customers</div>
          <strong>{loading ? "Loading..." : data?.metrics.customers ?? 0}</strong>
        </article>
      </div>
      <IntegrationExample />
      <AuthExample />
    </PlaceholderPage>
  );
}
