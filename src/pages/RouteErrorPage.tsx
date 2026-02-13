import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'

import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'

export function RouteErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  const title = isRouteErrorResponse(error) ? `页面错误 ${error.status}` : '页面发生异常'
  const description = isRouteErrorResponse(error)
    ? error.statusText || '目标页面不可用。'
    : '请求的页面不存在，或发生了未处理错误。'

  return (
    <main style={{ maxWidth: 960, margin: '64px auto', padding: '0 16px' }}>
      <EmptyState
        title={title}
        description={description}
        action={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <Button tone="ghost" onClick={() => navigate(-1)}>
              返回上一页
            </Button>
            <Button onClick={() => navigate('/')}>回到首页</Button>
          </div>
        }
      />
    </main>
  )
}
