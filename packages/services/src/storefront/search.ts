import { getSanityClient, toImage, toTaxedPrice } from '@siggistore/sanity';

export interface Product {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  variants?: any[];
  tags?: string[];
  categories?: string[];
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'title' | 'price_asc' | 'price_desc' | 'newest';
}

export interface SearchResult {
  products: Product[];
  total: number;
  hasMore: boolean;
}

export interface SearchService {
  searchProducts(query: string, filters?: SearchFilters, options?: SearchOptions): Promise<SearchResult>;
}

const buildSearchProductsQuery = (
  searchQuery: string,
  filters: SearchFilters = {},
  options: SearchOptions = {}
) => {
  const { category, minPrice, maxPrice, tags } = filters;
  const { limit = 20, offset = 0, sortBy = 'title' } = options;

  let filterConditions = [
    '_type == "product"',
    `title match "*${searchQuery}*" || description match "*${searchQuery}*"`
  ];

  if (category) {
    filterConditions.push(`references("${category}")`);
  }

  if (minPrice !== undefined) {
    filterConditions.push(`price >= ${minPrice}`);
  }

  if (maxPrice !== undefined) {
    filterConditions.push(`price <= ${maxPrice}`);
  }

  if (tags && tags.length > 0) {
    const tagConditions = tags.map(tag => `tags[] match "*${tag}*"`).join(' || ');
    filterConditions.push(`(${tagConditions})`);
  }

  const filter = filterConditions.join(' && ');

  let orderBy = 'title asc';
  switch (sortBy) {
    case 'price_asc':
      orderBy = 'price asc';
      break;
    case 'price_desc':
      orderBy = 'price desc';
      break;
    case 'newest':
      orderBy = '_createdAt desc';
      break;
  }

  return `*[${filter}] | order(${orderBy}) [${offset}...${offset + limit}]{
    _id,
    title,
    slug,
    description,
    price,
    compareAtPrice,
    images,
    variants,
    tags,
    categories
  }`;
};

export const createSearchService = (config: { currency?: string } = {}): SearchService => {
  return {
    async searchProducts(
      query: string,
      filters: SearchFilters = {},
      options: SearchOptions = {}
    ): Promise<SearchResult> {
      try {
        const client = getSanityClient();
        const searchQuery = buildSearchProductsQuery(query, filters, options);
        const products = await client.fetch(searchQuery);

        const transformedProducts = products.map((product: any) => ({
          ...product,
          price: toTaxedPrice(product.price),
          compareAtPrice: product.compareAtPrice ? toTaxedPrice(product.compareAtPrice) : undefined,
          images: product.images?.map((img: any) => toImage(img)).filter(Boolean) || [],
        }));

        const total = transformedProducts.length + (options.offset || 0);
        const hasMore = transformedProducts.length === (options.limit || 20);

        return {
          products: transformedProducts,
          total,
          hasMore,
        };
      } catch (error) {
        console.error('Error searching products in Sanity:', error);
        throw new Error(`Failed to search products: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  };
};
