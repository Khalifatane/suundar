function toArray(value) {
  if (Array.isArray(value)) return value
  if (value == null || value === '') return []
  return [value]
}

function cleanupValue(value) {
  if (value == null) return null
  if (typeof value === 'string' && value.trim() === '') return null
  if (Array.isArray(value) && value.length === 0) return null
  return value
}

export function createTableUrlState(config = {}) {
  const {
    pageKey = 'page',
    pageSizeKey = 'pageSize',
    filterKey = 'filter',
    defaultPage = 1,
    defaultPageSize = 10,
  } = config

  function read(search = window.location.search) {
    const params = new URLSearchParams(search)

    return {
      page: Math.max(1, Number(params.get(pageKey) || defaultPage)),
      pageSize: Math.max(1, Number(params.get(pageSizeKey) || defaultPageSize)),
      filter: params.get(filterKey) || '',
      status: params.get('status') || 'all',
      from: params.get('from') || '',
      to: params.get('to') || '',
      query: params.get('query') || '',
      selected: toArray(params.getAll('selected')),
    }
  }

  function write(patch = {}, options = {}) {
    const { replace = false, resetPage = false } = options
    const current = read()
    const next = { ...current, ...patch }
    const params = new URLSearchParams(window.location.search)

    if (resetPage) {
      next.page = defaultPage
    }

    const values = [
      [pageKey, next.page === defaultPage ? null : String(next.page)],
      [
        pageSizeKey,
        next.pageSize === defaultPageSize ? null : String(next.pageSize),
      ],
      [filterKey, cleanupValue(next.filter)],
      ['status', next.status === 'all' ? null : next.status],
      ['from', cleanupValue(next.from)],
      ['to', cleanupValue(next.to)],
      ['query', cleanupValue(next.query)],
    ]

    values.forEach(([key, value]) => {
      if (value == null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    params.delete('selected')
    toArray(next.selected).forEach((value) => params.append('selected', value))

    const search = params.toString()
    const url = `${window.location.pathname}${search ? `?${search}` : ''}${
      window.location.hash
    }`

    window.history[replace ? 'replaceState' : 'pushState']({}, '', url)

    return read()
  }

  function setPage(page) {
    return write({ page })
  }

  function setPageSize(pageSize) {
    return write({ pageSize }, { resetPage: true })
  }

  function setFilter(filter) {
    return write({ filter }, { resetPage: true })
  }

  function setStatus(status) {
    return write({ status }, { resetPage: true })
  }

  function setQuery(query) {
    return write({ query }, { resetPage: true })
  }

  function setDateRange({ from, to }) {
    return write({ from, to }, { resetPage: true })
  }

  function toggleSelected(value) {
    const state = read()
    const selected = new Set(state.selected)

    if (selected.has(value)) {
      selected.delete(value)
    } else {
      selected.add(value)
    }

    return write({ selected: Array.from(selected) })
  }

  function clearSelected() {
    return write({ selected: [] }, { replace: true })
  }

  function ensurePageInRange(totalItems) {
    const state = read()
    const pageCount = Math.max(1, Math.ceil(totalItems / state.pageSize))

    if (state.page > pageCount) {
      return write({ page: pageCount }, { replace: true })
    }

    return state
  }

  return {
    read,
    getState: read,
    write,
    setPage,
    setPageSize,
    setFilter,
    setStatus,
    setQuery,
    setDateRange,
    toggleSelected,
    clearSelected,
    ensurePageInRange,
  }
}

export default createTableUrlState
