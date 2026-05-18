import { useState, useEffect } from 'react';
import { sanityCMSPage, sanitySearch, sanityCollection, sanityStore, sanityMenu } from '@siggistore/services/storefront/initialized-services';
import type { SearchProduct as Product, SearchResult, SearchFilters, SearchOptions } from '@siggistore/services/storefront';

/**
 * Hook for searching products
 */
export const useProductSearch = () => {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (
    query: string,
    filters?: SearchFilters,
    options?: SearchOptions
  ) => {
    setLoading(true);
    setError(null);

    try {
      const searchResult = await sanitySearch.searchProducts(query, filters, options);
      setResults(searchResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
};

/**
 * Hook for fetching product details
 */
export const useProductDetails = (slug: string | null) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const productDetails = await sanityStore.getProductDetails(slug);
        setProduct(productDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
};

/**
 * Hook for fetching categories
 */
export const useCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const cats = await sanityCollection.getCategories();
        setCategories(cats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

/**
 * Hook for fetching collection details
 */
export const useCollectionDetails = (slug: string | null) => {
  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCollection = async () => {
      setLoading(true);
      setError(null);

      try {
        const collectionDetails = await sanityCollection.getCollectionDetails(slug);
        setCollection(collectionDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collection');
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [slug]);

  return { collection, loading, error };
};

/**
 * Hook for fetching CMS pages
 */
export const useCMSPage = (slug: string | null) => {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      setLoading(true);
      setError(null);

      try {
        const pageData = await sanityCMSPage.getPage(slug);
        setPage(pageData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch page');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  return { page, loading, error };
};

/**
 * Hook for fetching navigation menu
 */
export const useNavigationMenu = () => {
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);

      try {
        const menuData = await sanityMenu.getMenu('navbar');
        setMenu(menuData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return { menu, loading, error };
};
