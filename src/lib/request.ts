interface RequestOptions {
  retries?: number
  retryDelayMs?: number
  signal?: AbortSignal | undefined
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function requestWithRetry<T>(
  task: (signal: AbortSignal) => Promise<T>,
  options: RequestOptions = {},
): Promise<T> {
  const { retries = 2, retryDelayMs = 300, signal } = options
  const controller = new AbortController()
  if (signal) {
    signal.addEventListener('abort', () => controller.abort(signal.reason), { once: true })
  }

  let attempt = 0
  let latestError: unknown

  while (attempt <= retries) {
    if (controller.signal.aborted) {
      throw new DOMException('Request aborted', 'AbortError')
    }

    try {
      return await task(controller.signal)
    } catch (error) {
      latestError = error
      if (controller.signal.aborted || attempt === retries) {
        throw latestError
      }
      const backoff = retryDelayMs * 2 ** attempt
      await wait(backoff)
      attempt += 1
    }
  }

  throw latestError
}

export async function simulateLatency<T>(
  producer: () => T,
  signal?: AbortSignal,
  latency = 80 + Math.random() * 120,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      try {
        resolve(producer())
      } catch (error) {
        reject(error)
      }
    }, latency)

    if (signal) {
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timeout)
          reject(new DOMException('Request aborted', 'AbortError'))
        },
        { once: true },
      )
    }
  })
}
