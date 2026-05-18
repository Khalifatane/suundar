import React, { useState, useEffect } from 'react';
import { useProductSearch, useSupabaseAuthService, useSupabaseUserService } from '../hooks';
import { supabase } from '../lib/supabase';

/**
 * Example component demonstrating the complete Sanity + Supabase integration
 * This shows how to use both CMS content and user authentication together
 */
export const IntegrationExample: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sanity hooks
  const { results: searchResults, loading: searchLoading, search } = useProductSearch();

  // Supabase service hooks
  const { user: serviceUser, loading: userLoading, accountRegister } = useSupabaseAuthService();
  const { orders, fetchOrders } = useSupabaseUserService(user?.access_token);

  // Listen to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  };

  const handleRegister = async () => {
    const result = await accountRegister(
      'test@example.com',
      'password123',
      'John',
      'Doe'
    );

    if (result.success) {
      console.log('Registration successful:', result.data);
    } else {
      console.error('Registration failed:', result.errors);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Sanity + Supabase Integration Example</h1>

      {/* Authentication Section */}
      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Authentication (Supabase)</h2>

        {user ? (
          <div>
            <p className="text-green-600">Logged in as: {user.email}</p>
            <button
              onClick={() => supabase.auth.signOut()}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600">Not logged in</p>
            <button
              onClick={handleRegister}
              disabled={userLoading}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {userLoading ? 'Registering...' : 'Register Test User'}
            </button>
          </div>
        )}

        {/* User Orders */}
        {user && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Your Orders:</h3>
            {orders.length > 0 ? (
              <ul className="list-disc list-inside">
                {orders.map((order) => (
                  <li key={order.id}>
                    Order #{order.number} - {order.status} - {order.total.currency} {order.total.amount}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No orders found</p>
            )}
          </div>
        )}
      </section>

      {/* Product Search Section */}
      <section className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Product Search (Sanity)</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-3 py-2 border rounded"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div>
            <p className="mb-2 text-gray-600">
              Found {searchResults.products.length} products
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.products.map((product) => (
                <div key={product._id} className="border rounded p-4">
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-lg font-bold text-green-600">
                    ${product.price}
                  </p>
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-32 object-cover mt-2 rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Integration Status */}
      <section className="p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Integration Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Sanity CMS</h3>
            <p className="text-sm text-gray-600">
              Project ID: {(import.meta.env.VITE_SANITY_PROJECT_ID || import.meta.env.NEXT_PUBLIC_SANITY_PROJECT_ID) ? '✅ Configured' : '❌ Missing'}
            </p>
            <p className="text-sm text-gray-600">
              Dataset: {import.meta.env.VITE_SANITY_DATASET || import.meta.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Supabase</h3>
            <p className="text-sm text-gray-600">
              URL: {(import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL) ? '✅ Configured' : '❌ Missing'}
            </p>
            <p className="text-sm text-gray-600">
              Auth: {user ? '✅ Active' : '⏳ Not logged in'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntegrationExample;
