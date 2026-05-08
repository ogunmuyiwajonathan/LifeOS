export const INITIAL_STREAK_DATA = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  totalDaysActive: 0,
  history: [],
  moduleStreaks: {
    money: { current: 0, longest: 0, lastActive: null },
    habits: { current: 0, longest: 0, lastActive: null },
    learning: { current: 0, longest: 0, lastActive: null },
    opportunities: { current: 0, longest: 0, lastActive: null },
  },
}

// Get today's date as ISO string (without time)
export const getTodayISO = () => new Date().toISOString().split('T')[0]

// Get yesterday's date as ISO string
export const getYesterdayISO = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

// Load streak data from localStorage
const mergeWithDefaults = (value = {}) => ({
  ...INITIAL_STREAK_DATA,
  ...value,
  history: Array.isArray(value.history)
    ? value.history
    : Array.isArray(value.streakHistory)
      ? value.streakHistory
      : [],
  moduleStreaks: {
    ...INITIAL_STREAK_DATA.moduleStreaks,
    ...(value.moduleStreaks || {}),
  },
})

export const getStreakData = () => {
  const stored = localStorage.getItem('lifeosStreakData')
  if (!stored) return mergeWithDefaults()
  try {
    return mergeWithDefaults(JSON.parse(stored))
  } catch (error) {
    return mergeWithDefaults()
  }
}

// Save streak data to localStorage
export const saveStreakData = (data) => {
  localStorage.setItem('lifeosStreakData', JSON.stringify(data))
  return data
}

export const updateGlobalStreak = () => {
  const data = getStreakData()
  const today = getTodayISO()
  const yesterday = getYesterdayISO()

  if (!data.lastActiveDate) {
    data.currentStreak = 1
    data.longestStreak = 1
    data.totalDaysActive = 1
    data.lastActiveDate = today
  } else if (data.lastActiveDate === today) {
    return saveStreakData(withHistory(data, today))
  } else if (data.lastActiveDate === yesterday) {
    data.currentStreak += 1
    data.totalDaysActive += 1
    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak
    }
    data.lastActiveDate = today
  } else {
    data.currentStreak = 1
    data.totalDaysActive += 1
    data.lastActiveDate = today
  }

  return saveStreakData(withHistory(data, today))
}

const withHistory = (data, todayISO) => {
  const today = todayISO || getTodayISO()
  const historyMap = new Map((data.history || []).map((item) => [item.date, item]))
  historyMap.set(today, { date: today, active: true })
  const history = Array.from(historyMap.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
  return { ...data, history }
}

export const updateModuleStreak = (moduleName) => {
  const data = getStreakData()
  const today = getTodayISO()
  const yesterday = getYesterdayISO()

  if (!data.moduleStreaks[moduleName]) {
    data.moduleStreaks[moduleName] = { current: 0, longest: 0, lastActive: null }
  }

  const module = data.moduleStreaks[moduleName]

  if (!module.lastActive) {
    module.current = 1
    module.longest = 1
    module.lastActive = today
  } else if (module.lastActive === today) {
    // Already counted today
    return data
  } else if (module.lastActive === yesterday) {
    module.current += 1
    if (module.current > module.longest) {
      module.longest = module.current
    }
    module.lastActive = today
  } else {
    module.current = 1
    module.lastActive = today
  }

  return saveStreakData(data)
}

// Get last 7 days activity
export const getLast7DaysActivity = () => {
  const data = getStreakData()
  const historySet = new Set((data.history || []).filter((item) => item.active).map((item) => item.date))
  const today = new Date()
  const days = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateISO = date.toISOString().split('T')[0]
    const isActive = historySet.has(dateISO)
    days.push({
      date: dateISO,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      isActive,
      isToday: dateISO === getTodayISO(),
    })
  }

  return days
}

// Get motivational message based on streak
export const getStreakMessage = (streak) => {
  if (streak < 3) {
    return "Keep going! Come back tomorrow"
  } else if (streak <= 6) {
    return "Building momentum"
  } else if (streak >= 30) {
    return "Legendary streak"
  } else if (streak >= 7) {
    return "You're on fire"
  }
  return "Keep going! Come back tomorrow"
}
