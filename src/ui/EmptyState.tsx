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
      className="rounded-2xl border border-[var(--border)] bg-[#fbfcfe] px-6 py-7 text-center shadow-[0_2px_10px_rgba(18,23,33,0.04)]"
      role="status"
    >
      <h3 className="m-0 text-lg font-semibold tracking-[0.2px]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}
