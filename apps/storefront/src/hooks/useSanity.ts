// React hooks for Sanity CMS integration
import { useEffect, useState, useCallback } from 'react';
import sanityService from '@siggistore/services/storefront/sanity-service';
import type { SanityProduct, SanityCategory } from '@siggistore/shared-types';

export const useSanityProducts = (limit = 20, offset = 0) => {
  const [products, setProducts] = useState<SanityProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await sanityService.getProducts(limit, offset);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(String(err));
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit, offset]);

  return { products, loading, error };
};

export const useSanityProductBySlug = (slug: string | null) => {
  const [product, setProduct] = useState<SanityProduct | null>(null);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await sanityService.getProductBySlug(slug);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(String(err));
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
};

export const useSanityCategories = () => {
  const [categories, setCategories] = useState<SanityCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await sanityService.getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError(String(err));
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useSanitySearch = (searchTerm: string) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await sanityService.search(term);
      setResults(data);
      setError(null);
    } catch (err) {
      setError(String(err));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      search(searchTerm);
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [searchTerm, search]);

  return { results, loading, error, search };
};

export const useSanityProductsByCategory = (categorySlug: string | null, limit = 20, offset = 0) => {
  const [products, setProducts] = useState<SanityProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(!!categorySlug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await sanityService.getProductsByCategory(categorySlug, limit, offset);
        setProducts(data.data);
        setTotal(data.total);
        setError(null);
      } catch (err) {
        setError(String(err));
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, limit, offset]);

  return { products, total, loading, error };
};
