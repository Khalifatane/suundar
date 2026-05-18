import { getSanityClient, toImage, toTaxedPrice } from '@siggistore/sanity';

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  image?: string;
}

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
}

export interface CollectionDetails {
  category: Category;
  products: Product[];
  total: number;
}

export interface CollectionService {
  getCollectionDetails(slug: string, options?: { limit?: number; offset?: number }): Promise<CollectionDetails>;
  getCategories(): Promise<Category[]>;
}

const categoryQuery = `*[_type == "category" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  description,
  image
}`;

const productsByCategoryQuery = `*[_type == "product" && references($categoryId)] | order(title asc) [$offset...$limit]{
  _id,
  title,
  slug,
  description,
  price,
  compareAtPrice,
  images,
  variants,
  tags
}`;

const categoriesQuery = `*[_type == "category"] | order(title asc){
  _id,
  title,
  slug,
  description,
  image
}`;

export const createCollectionService = (config: { currency?: string } = {}): CollectionService => {
  return {
    async getCollectionDetails(
      slug: string,
      options: { limit?: number; offset?: number } = {}
    ): Promise<CollectionDetails> {
      try {
        const client = getSanityClient();
        const { limit = 20, offset = 0 } = options;

        const category = await client.fetch(categoryQuery, { slug });

        if (!category) {
          throw new Error(`Category with slug "${slug}" not found`);
        }

        const products = await client.fetch(productsByCategoryQuery, {
          categoryId: category._id,
          offset,
          limit: offset + limit,
        });

        const transformedProducts = products.map((product: any) => ({
          ...product,
          price: toTaxedPrice(product.price),
          compareAtPrice: product.compareAtPrice ? toTaxedPrice(product.compareAtPrice) : undefined,
          images: product.images?.map((img: any) => toImage(img)).filter(Boolean) || [],
        }));

        return {
          category: {
            ...category,
            image: toImage(category.image),
          },
          products: transformedProducts,
          total: transformedProducts.length,
        };
      } catch (error) {
        console.error('Error fetching collection details from Sanity:', error);
        throw new Error(`Failed to fetch collection details: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    async getCategories(): Promise<Category[]> {
      try {
        const client = getSanityClient();
        const categories = await client.fetch(categoriesQuery);

        return categories.map((category: any) => ({
          ...category,
          image: toImage(category.image),
        }));
      } catch (error) {
        console.error('Error fetching categories from Sanity:', error);
        throw new Error(`Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  };
};
