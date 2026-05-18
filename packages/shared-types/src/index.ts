// Unified shared types for both storefront and admin applications

// ===== AUTH TYPES =====

export type UserRole = 'customer' | 'admin' | 'seller';

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type UnifiedAuthState = {
  user: AuthUser | null;
  session: AuthSession | null;
  status: "loading" | "authenticated" | "signed_out" | "forbidden";
};

// ===== SANITY CMS TYPES =====

export interface SanityProduct {
  _id: string;
  _type: 'product';
  title: string;
  slug: { current: string };
  description?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image?: {
    _type: 'image';
    asset: {
      _id: string;
      url: string;
    };
  };
  images?: Array<{
    _type: 'image';
    asset: {
      _id: string;
      url: string;
    };
  }>;
  category?: { _ref: string; _type: 'reference' };
  sku?: string;
  stock?: number;
  _createdAt: string;
  _updatedAt: string;
}

export interface SanityCategory {
  _id: string;
  _type: 'category';
  title: string;
  slug: { current: string };
  description?: string;
  image?: {
    _type: 'image';
    asset: {
      _id: string;
      url: string;
    };
  };
}

export interface SanityPage {
  _id: string;
  _type: 'page';
  title: string;
  slug: { current: string };
  content?: string;
  blocks?: any[];
}

// ===== SUPABASE TYPES =====

export interface SupabaseUser {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SupabaseProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  is_active?: boolean;
  role?: UserRole;
  deactivated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  title: string;
  image?: string;
}

export interface Address {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

export interface SupabaseOrder {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'paid' | 'failed' | 'refunded';
  total: number;
  total_amount?: number;
  currency: string;
  items: OrderItem[];
  order_items?: OrderItem[];
  shipping_address?: Address;
  billing_address?: Address;
  customer_id?: string;
  created_at: string;
  updated_at: string;
}

// ===== ADMIN TYPES =====

export interface SanityProductRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl: string;
  status: string;
  isAvailable: boolean;
  channels: string[];
}

export interface OverviewMetrics {
  revenue: number;
  orders: number;
  customers: number;
  averageOrderValue: number;
  pendingOrders: number;
  failedOrders: number;
  refundedOrders: number;
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ===== SEARCH & FILTER TYPES =====

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  type: 'product' | 'category' | 'page';
  description?: string;
  image?: string;
  url?: string;
}

// ===== LOGGER TYPE =====

export interface Logger {
  error: (message: string, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  info: (message: string, meta?: any) => void;
  debug: (message: string, meta?: any) => void;
}
