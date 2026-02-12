export const perfNow = () => performance.now()

export const formatMs = (ms: number) => `${ms.toFixed(2)}ms`

export function measure<T>(label: string, task: () => T): T {
  const start = perfNow()
  const result = task()
  const end = perfNow()
  if (import.meta.env.DEV) {
    console.info(`[perf] ${label}: ${formatMs(end - start)}`)
  }
  return result
}

export function rafThrottle<Args extends unknown[]>(fn: (...args: Args) => void) {
  let ticking = false
  return (...args: Args) => {
    if (ticking) {
      return
    }
    ticking = true
    requestAnimationFrame(() => {
      fn(...args)
      ticking = false
    })
  }
}
