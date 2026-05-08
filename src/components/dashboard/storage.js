export const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (error) {
    return fallback
  }
}

export const writeJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const readRoot = (key) => readJSON(key, {})

export const updateRoot = (key, updater) => {
  const current = readRoot(key)
  const next = updater(current)
  writeJSON(key, next)
  return next
}

export const getDateISO = (date = new Date()) => date.toISOString().split('T')[0]

export const getYesterdayISO = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return getDateISO(d)
}

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(
    Number(value || 0)
  )
