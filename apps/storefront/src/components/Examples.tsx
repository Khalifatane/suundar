// Example: Using Sanity Products in a React Component
import React from 'react';
import { useSanityProducts, useSanitySearch } from '../hooks';
import { formatCurrency, getSanityImageUrl, truncateText } from '../lib/utils';
import type { SanityProduct } from '@siggistore/shared-types';

interface ProductListProps {
  limit?: number;
  categorySlug?: string;
}

export const ProductList: React.FC<ProductListProps> = ({ limit = 12, categorySlug }) => {
  const { products, loading, error } = useSanityProducts(limit, 0);

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Error: {error}</div>;
  }

  if (!products.length) {
    return <div className="text-center py-12">No products found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product: SanityProduct) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

interface ProductCardProps {
  product: SanityProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {product.image && (
        <img
          src={product.image.asset.url}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{truncateText(product.title, 40)}</h3>
        {product.description && (
          <p className="text-gray-600 text-sm mb-2">{truncateText(product.description, 60)}</p>
        )}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold">{formatCurrency(product.price, product.currency)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatCurrency(product.originalPrice, product.currency)}
              </span>
            )}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// Example: Search Component
interface SearchProps {
  onSelect?: (result: any) => void;
}

export const SearchComponent: React.FC<SearchProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { results, loading } = useSanitySearch(searchTerm);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      {searchTerm && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-96 overflow-y-auto">
          {loading && <div className="p-4 text-center">Searching...</div>}
          {!loading && results.length === 0 && (
            <div className="p-4 text-center text-gray-500">No results found</div>
          )}
          {results.map((result) => (
            <button
              key={result._id}
              onClick={() => {
                onSelect?.(result);
                setSearchTerm('');
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
            >
              <div className="font-semibold">{result.title}</div>
              <div className="text-sm text-gray-500">{result._type}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
