import { useEffect, useMemo, useState } from "react";
import { getSanityClient } from "@siggistore/sanity";

const sanityClient = getSanityClient();

export function useSanityProducts(query = "") {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        const searchFilter = query
          ? `&& (title match "${query}*" || slug.current match "${query}*")`
          : "";
        const items = await sanityClient.fetch(
          `*[_type == "product" ${searchFilter}] | order(_updatedAt desc) [0...24] {
            _id, title, slug, price, stock, status,
            "image": image.asset->url
          }`
        );
        if (active) setProducts(items || []);
      } catch (err) {
        console.error("Error fetching Sanity products:", err);
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [query]);

  return useMemo(() => ({ products, loading }), [products, loading]);
}

export function useSanityProductBySlug(slug?: string) {
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let active = true;

    const fetchProduct = async () => {
      try {
        const item = await sanityClient.fetch(
          `*[_type == "product" && (slug.current == $slug || _id == $slug)][0]`,
          { slug }
        );
        if (active) setProduct(item);
      } catch (err) {
        console.error("Error fetching Sanity product:", err);
        if (active) setProduct(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  return useMemo(() => ({ product, loading }), [product, loading]);
}
