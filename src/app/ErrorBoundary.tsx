import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'

import { logger } from '../lib/logger'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('Global error boundary caught error', error, info)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main style={{ maxWidth: 960, margin: '64px auto', padding: '0 16px' }}>
          <EmptyState
            title="页面发生错误"
            description="应用捕获到运行时异常，请刷新页面重试。"
            action={
              <Button tone="ghost" onClick={() => window.location.reload()}>
                刷新页面
              </Button>
            }
          />
        </main>
      )
    }

    return this.props.children
  }
}
