/**
 * Storefront Supabase Service
 *
 * Wraps the shared @siggistore/auth and @siggistore/supabase packages
 * to provide the storefront-specific API surface.
 */
import { getSupabase } from '@siggistore/supabase';
import { signIn, signUp, signOut, resetPassword, updatePassword } from '@siggistore/auth';
import type {
  SupabaseUser,
  SupabaseProfile,
  SupabaseOrder,
  ApiResponse,
} from '@siggistore/shared-types';

const supabase = getSupabase();

export const supabaseAuthService = {
  async signUp(email: string, password: string): Promise<ApiResponse<SupabaseUser>> {
    const result = await signUp(email, password);
    if (result.success && result.data) {
      return {
        success: true,
        data: {
          id: result.data.id,
          email: result.data.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as SupabaseUser,
      };
    }
    return { success: false, error: result.error };
  },

  async signIn(email: string, password: string): Promise<ApiResponse<SupabaseUser>> {
    const result = await signIn(email, password);
    if (result.success && result.data) {
      const { data: sessionData } = await supabase.auth.getSession();
      return {
        success: true,
        data: (sessionData.session?.user as SupabaseUser) || (result.data as unknown as SupabaseUser),
      };
    }
    return { success: false, error: result.error };
  },

  async signOut(): Promise<ApiResponse<void>> {
    return signOut();
  },

  async getCurrentUser(): Promise<SupabaseUser | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return (data.session?.user as SupabaseUser) || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async resetPassword(email: string): Promise<ApiResponse<void>> {
    return resetPassword(email);
  },

  async updatePassword(newPassword: string): Promise<ApiResponse<void>> {
    return updatePassword(newPassword);
  },

  async uploadAvatar(userId: string, file: File): Promise<ApiResponse<string>> {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const path = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file);
      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: urlData.publicUrl },
      });

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true, data: urlData.publicUrl };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  onAuthStateChange(callback: (user: SupabaseUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      callback((session?.user as SupabaseUser) || null);
    });
  },
};

export const supabaseProfileService = {
  async getProfile(userId: string): Promise<ApiResponse<SupabaseProfile>> {
    try {
      const { data, error } = await supabase.from('profiles').select().eq('user_id', userId).single();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  async createProfile(
    profile: Omit<SupabaseProfile, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<ApiResponse<SupabaseProfile>> {
    try {
      const { data, error } = await supabase.from('profiles').insert(profile).select().single();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  async upsertProfile(userId: string, profile: Partial<SupabaseProfile>): Promise<ApiResponse<SupabaseProfile>> {
    try {
      const { data, error } = await supabase.from('profiles').upsert({ user_id: userId, ...profile }).select().single();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  async deleteProfile(userId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};

export const supabaseOrderService = {
  async getOrders(userId: string): Promise<ApiResponse<SupabaseOrder[]>> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) return { success: false, error: error.message };
      return { success: true, data: (data || []) as SupabaseOrder[] };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  async getOrder(orderId: string): Promise<ApiResponse<SupabaseOrder>> {
    try {
      const { data, error } = await supabase.from('orders').select().eq('id', orderId).single();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  async createOrder(
    order: Omit<SupabaseOrder, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<ApiResponse<SupabaseOrder>> {
    try {
      const { data, error } = await supabase.from('orders').insert([order]).select().single();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  async updateOrder(orderId: string, updates: Partial<SupabaseOrder>): Promise<ApiResponse<SupabaseOrder>> {
    try {
      const { data, error } = await supabase.from('orders').update(updates).eq('id', orderId).select().single();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};

export const supabaseCartService = {
  async saveCart(userId: string, items: any[]): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('carts')
        .upsert({ user_id: userId, items, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  async getCart(userId: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase.from('carts').select().eq('user_id', userId).single();
      if (error && error.code !== 'PGRST116') {
        return { success: false, error: error.message };
      }
      return { success: true, data: data || { items: [] } };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  async clearCart(userId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from('carts').delete().eq('user_id', userId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};

function isMissingReviewTableError(error: any, tableName: string) {
  const details = [error?.message, error?.details, error?.hint]
    .filter(Boolean)
    .map(String)
    .join(' ');

  return (
    error?.code === '42P01' ||
    new RegExp(`Could not find the table ['"]?public\\.${tableName}['"]? in the schema cache`, 'i').test(details) ||
    new RegExp(`relation ['"]?public\\.${tableName}['"]? does not exist`, 'i').test(details) ||
    new RegExp(`relation ['"]?${tableName}['"]? does not exist`, 'i').test(details)
  );
}

function normalizeReviewRow(row: any) {
  if (!row) return row;
  return {
    ...row,
    product_slug: row.product_slug ?? row.slug ?? '',
    product_title_snapshot: row.product_title_snapshot ?? row.title ?? '',
    product_image_snapshot: row.product_image_snapshot ?? row.image ?? '',
    customer_name: row.customer_name ?? row.nickname ?? 'Guest',
    customer_email: row.customer_email ?? row.email ?? '',
    rating: Math.max(1, Math.min(5, Number(row.rating ?? 5) || 5)),
    recommendation: row.recommendation === 'no' ? 'no' : 'yes',
    helpful_yes: Number(row.helpful_yes ?? 0) || 0,
    helpful_no: Number(row.helpful_no ?? 0) || 0,
    status: row.status ?? 'pending',
  };
}

function normalizeReplyRow(row: any) {
  if (!row) return row;
  return {
    ...row,
    body: row.body ?? row.content ?? '',
  };
}

export const supabaseReviewService = {
  async submitReview(review: any): Promise<ApiResponse<any>> {
    try {
      const payload = {
        product_slug: String(review?.product_slug ?? review?.slug ?? '').trim(),
        sanity_product_id: String(review?.sanity_product_id ?? '').trim() || null,
        product_title_snapshot: String(
          review?.product_title_snapshot ?? review?.title ?? review?.product_title ?? '',
        ).trim(),
        product_image_snapshot: String(
          review?.product_image_snapshot ?? review?.image ?? review?.product_image ?? '',
        ).trim(),
        customer_id: review?.customer_id ?? null,
        customer_name: String(review?.customer_name ?? review?.nickname ?? '').trim(),
        customer_email: String(review?.customer_email ?? review?.email ?? '').trim(),
        rating: Math.max(1, Math.min(5, Number(review?.rating ?? 5) || 5)),
        recommendation:
          String(review?.recommendation ?? 'yes').trim().toLowerCase() === 'no' ? 'no' : 'yes',
        headline: String(review?.headline ?? '').trim(),
        body: String(review?.body ?? '').trim(),
        status: String(review?.status ?? 'published').trim().toLowerCase(),
        helpful_yes: Number(review?.helpful_yes ?? 0) || 0,
        helpful_no: Number(review?.helpful_no ?? 0) || 0,
      };

      const { data, error } = await supabase.from('product_reviews').insert(payload).select().single();
      if (error) {
        if (isMissingReviewTableError(error, 'product_reviews')) {
          return {
            success: false,
            error:
              'The Supabase table public.product_reviews does not exist yet. Create it before using product reviews.',
          };
        }
        return { success: false, error: error.message };
      }

      return { success: true, data: normalizeReviewRow(data) };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  async getPublishedReviewsByProduct(details: {
    slug?: string | null;
    title?: string | null;
    limit?: number | null;
  }): Promise<ApiResponse<any[]>> {
    try {
      const slug = String(details?.slug ?? '').trim();
      const title = String(details?.title ?? '').trim();
      const limit = Math.max(1, Number(details?.limit ?? 25) || 25);

      let request = supabase
        .from('product_reviews')
        .select()
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (slug) {
        request = request.eq('product_slug', slug);
      } else if (title) {
        request = request.eq('product_title_snapshot', title);
      } else {
        return { success: true, data: [] };
      }

      const { data, error } = await request;
      if (error) {
        if (isMissingReviewTableError(error, 'product_reviews')) {
          return { success: true, data: [] };
        }
        return { success: false, error: error.message };
      }

      const reviews = (data || []).map(normalizeReviewRow);
      if (!reviews.length) {
        return { success: true, data: [] };
      }

      const reviewIds = reviews.map((review: any) => review.id).filter(Boolean);
      const { data: replies, error: repliesError } = await supabase
        .from('product_review_replies')
        .select()
        .in('review_id', reviewIds)
        .order('created_at', { ascending: false });

      if (repliesError && !isMissingReviewTableError(repliesError, 'product_review_replies')) {
        return { success: false, error: repliesError.message };
      }

      const repliesByReviewId = (replies || []).map(normalizeReplyRow).reduce(function (map: Record<string, any[]>, reply: any) {
        const key = String(reply.review_id || '');
        if (!key) return map;
        if (!Array.isArray(map[key])) map[key] = [];
        map[key].push(reply);
        return map;
      }, {});

      return {
        success: true,
        data: reviews.map(function (review: any) {
          const reviewReplies = repliesByReviewId[String(review.id)] || [];
          return {
            ...review,
            replies: reviewReplies,
            latest_reply: reviewReplies[0] || null,
          };
        }),
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};

export default {
  auth: supabaseAuthService,
  profile: supabaseProfileService,
  order: supabaseOrderService,
  cart: supabaseCartService,
  review: supabaseReviewService,
};
