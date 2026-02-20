import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <article
      className={`rounded-[14px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_2px_10px_rgba(0,0,0,0.05)] ${className}`.trim()}
    >
      {children}
    </article>
  )
}
