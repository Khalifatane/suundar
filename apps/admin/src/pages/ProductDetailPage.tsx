import { useParams } from "react-router-dom";
import { useSanityProductBySlug } from "@/hooks";
import { formatMoney } from "@/lib/utils";
import { PlaceholderPage } from "./_helpers";

export function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug || "product-detail";
  const { product, loading } = useSanityProductBySlug(slug);

  return (
    <PlaceholderPage
      title="Product Detail"
      description="Route params are resolved into Sanity lookups through the hook layer."
    >
      {loading ? (
        <p className="muted">Loading product...</p>
      ) : product ? (
        <div className="stack">
          <strong>{product.name}</strong>
          <span className="muted">{product.category}</span>
          <span>{formatMoney(product.price)}</span>
        </div>
      ) : (
        <p className="muted">No product selected.</p>
      )}
    </PlaceholderPage>
  );
}
