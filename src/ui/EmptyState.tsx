import type { ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div
      className="rounded-[14px] border border-[var(--border)] bg-[#fcfcfc] px-6 py-7 text-center"
      role="status"
    >
      <h3 className="m-0 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{description}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}
