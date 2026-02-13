import { Link } from 'react-router-dom'

import { EmptyState } from '../ui/EmptyState'

export function NotFoundPage() {
  return (
    <EmptyState
      title="404 页面不存在"
      description="你访问的地址不存在，返回内容流继续浏览。"
      action={<Link to="/">返回首页</Link>}
    />
  )
}
