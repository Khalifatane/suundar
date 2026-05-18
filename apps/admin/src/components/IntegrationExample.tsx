import { useOverviewMetrics, useSanityProducts } from "@/hooks";
import { formatMoney } from "@/lib/utils";

export function IntegrationExample() {
  const { data, loading } = useOverviewMetrics();
  const { products, loading: productsLoading } = useSanityProducts();

  return (
    <section className="page-card stack">
      <div className="page-header">
        <div>
          <h2>Integration Example</h2>
          <p className="muted">Sanity and Supabase consumed from the hook layer.</p>
        </div>
      </div>
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
          <div className="muted">Products</div>
          <strong>{productsLoading ? "Loading..." : products.length}</strong>
        </article>
      </div>
    </section>
  );
}
