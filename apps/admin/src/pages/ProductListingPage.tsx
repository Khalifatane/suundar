import { useSanityProducts } from "@/hooks";
import { formatMoney } from "@/lib/utils";
import { PlaceholderPage } from "./_helpers";

export function ProductListingPage() {
  const { products, loading } = useSanityProducts();

  return (
    <PlaceholderPage
      title="Product Listing"
      description="Sanity-backed product catalog inside the typed SPA runtime."
    >
      {loading ? (
        <p className="muted">Loading products...</p>
      ) : (
        <table className="table-preview">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 8).map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{formatMoney(product.price)}</td>
                <td>{product.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PlaceholderPage>
  );
}
