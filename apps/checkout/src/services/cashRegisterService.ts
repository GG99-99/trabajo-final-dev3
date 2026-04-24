type CashOpeningRecord = {
  amount: number
  setAt: string
}

type CashOpeningMap = Record<string, CashOpeningRecord>

const STORAGE_KEY = 'checkout_cash_openings_v1'

const dateKey = (date: string, cashierEmail: string) => `${date}::${cashierEmail.toLowerCase()}`

const todayDate = () => new Date().toISOString().split('T')[0]

function readMap(): CashOpeningMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as CashOpeningMap
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeMap(map: CashOpeningMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function getCashOpeningByDate(date: string, cashierEmail: string): number {
  if (!cashierEmail) return 0
  const map = readMap()
  return Number(map[dateKey(date, cashierEmail)]?.amount ?? 0)
}

export function hasTodayCashOpening(cashierEmail: string): boolean {
  return getCashOpeningByDate(todayDate(), cashierEmail) > 0 || readMap()[dateKey(todayDate(), cashierEmail)] !== undefined
}

export function setTodayCashOpening(cashierEmail: string, amount: number): void {
  if (!cashierEmail) return
  const map = readMap()
  map[dateKey(todayDate(), cashierEmail)] = {
    amount,
    setAt: new Date().toISOString(),
  }
  writeMap(map)
}

