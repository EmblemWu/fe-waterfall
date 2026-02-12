export const logger = {
  info: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.info('[info]', ...args)
    }
  },
  warn: (...args: unknown[]) => {
    console.warn('[warn]', ...args)
  },
  error: (...args: unknown[]) => {
    console.error('[error]', ...args)
  },
}
