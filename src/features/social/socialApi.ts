import { requestWithRetry, simulateLatency } from '../../lib/request'

function shouldFail(probability = 0.1) {
  return Math.random() < probability
}

async function runAction(signal?: AbortSignal) {
  return requestWithRetry(
    (innerSignal) =>
      simulateLatency(
        () => {
          if (shouldFail(0.1)) {
            throw new Error('SOCIAL_ACTION_FAILED')
          }
          return true
        },
        innerSignal,
        120 + Math.random() * 180,
      ),
    {
      signal,
      retries: 0,
      retryDelayMs: 200,
    },
  )
}

export const socialApi = {
  toggleLike: runAction,
  toggleFavorite: runAction,
  toggleFollow: runAction,
}
