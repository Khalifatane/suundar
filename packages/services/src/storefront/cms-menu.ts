import { getSanityClient } from '@siggistore/sanity';

export interface MenuItem {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  url?: string;
  children?: MenuItem[];
}

export interface Menu {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  items: MenuItem[];
}

export interface CMSMenuService {
  getMenu(slug: string): Promise<Menu | null>;
}

const categoriesQuery = `*[_type == "category"] | order(title asc){
  _id,
  title,
  "slug": slug.current
}`;

export const createCMSMenuService = (config?: any): CMSMenuService => {
  return {
    async getMenu(slug: string): Promise<Menu | null> {
      try {
        const client = getSanityClient();

        if (slug === 'navbar') {
          const categories = await client.fetch(categoriesQuery);

          const menuItems: MenuItem[] = categories.map((category: any) => ({
            _id: category._id,
            title: category.title,
            slug: { current: category.slug },
            url: `/collections/${category.slug}`,
          }));

          return {
            _id: 'navbar-menu',
            title: 'Navigation',
            slug: { current: 'navbar' },
            items: menuItems,
          };
        }

        console.warn(`Menu with slug "${slug}" not implemented`);
        return null;
      } catch (error) {
        console.error('Error fetching menu from Sanity:', error);
        throw new Error(`Failed to fetch menu: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  };
};
