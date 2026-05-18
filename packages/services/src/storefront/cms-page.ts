import { getSanityClient } from '@siggistore/sanity';

export interface CMSPage {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  content: any[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface CMSPageService {
  getPage(slug: string): Promise<CMSPage | null>;
}

const pageQuery = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  content,
  seo
}`;

export const createCMSPageService = (config?: any): CMSPageService => {
  return {
    async getPage(slug: string): Promise<CMSPage | null> {
      try {
        const client = getSanityClient();
        const page = await client.fetch(pageQuery, { slug });

        if (!page) {
          console.warn(`Page with slug "${slug}" not found`);
          return null;
        }

        return page;
      } catch (error) {
        console.error('Error fetching page from Sanity:', error);
        throw new Error(`Failed to fetch page: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  };
};
