import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_6px_20px_rgba(18,23,33,0.05)] ${className}`.trim()}
    >
      {children}
    </article>
  )
}
