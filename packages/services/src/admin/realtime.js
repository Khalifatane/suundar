import { getSupabase } from "@siggistore/supabase";

const supabase = getSupabase();

export function subscribeToTable(table, callback, options = {}) {
  const {
    schema = 'public',
    events = ['INSERT', 'UPDATE', 'DELETE'],
    channelName = `realtime-${table}-${Date.now()}`,
  } = options

  const channel = supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema, table }, (payload) => {
      if (!events.includes(payload.eventType)) return
      callback?.(payload)
    })
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export function subscribeToOrders(callback, options = {}) {
  return subscribeToTable('orders', callback, {
    channelName: 'orders-realtime',
    ...options,
  })
}

export function subscribeToDiscounts(callback, options = {}) {
  return subscribeToTable('discounts', callback, {
    channelName: 'discounts-realtime',
    ...options,
  })
}

export function subscribeToCustomers(callback, options = {}) {
  return subscribeToTable('customers', callback, {
    channelName: 'customers-realtime',
    ...options,
  })
}

export function subscribeToProfiles(callback, options = {}) {
  return subscribeToTable('profiles', callback, {
    channelName: 'profiles-realtime',
    ...options,
  })
}

export function subscribeToConversations(callback, options = {}) {
  return subscribeToTable('conversations', callback, {
    channelName: 'conversations-realtime',
    ...options,
  })
}

export function subscribeToMessages(callback, options = {}) {
  return subscribeToTable('messages', callback, {
    channelName: 'messages-realtime',
    ...options,
  })
}

export function subscribeToProductRuntime(callback, options = {}) {
  const {
    table = 'products_runtime',
    channelName = `${table}-realtime`,
    ...rest
  } = options

  return subscribeToTable(table, callback, {
    channelName,
    ...rest,
  })
}
