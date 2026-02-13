import { useEffect } from 'react'

import { AppRoutes } from './AppRoutes'
import { ErrorBoundary } from './ErrorBoundary'
import { AppProviders } from './providers'
import { logger } from '../lib/logger'

export function App() {
  useEffect(() => {
    const onGlobalError = (event: ErrorEvent) => {
      logger.error('Unhandled error', event.error)
    }

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled rejection', event.reason)
    }

    window.addEventListener('error', onGlobalError)
    window.addEventListener('unhandledrejection', onUnhandledRejection)

    return () => {
      window.removeEventListener('error', onGlobalError)
      window.removeEventListener('unhandledrejection', onUnhandledRejection)
    }
  }, [])

  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </ErrorBoundary>
  )
}
