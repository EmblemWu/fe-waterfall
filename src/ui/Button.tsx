import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'primary' | 'ghost' | 'danger'
}

const toneClassMap: Record<NonNullable<ButtonProps['tone']>, string> = {
  primary:
    'border border-transparent bg-[var(--accent)] text-white shadow-[0_8px_20px_rgba(255,36,66,0.22)] hover:bg-[var(--accent-strong)]',
  ghost:
    'border border-[var(--border)] bg-white text-[var(--text)] hover:border-[#d9dee6] hover:bg-[#f8f9fb]',
  danger: 'border border-[#ffd8de] bg-[#fff0f2] text-[var(--accent)] hover:bg-[#ffe7ec]',
}

export function Button({ tone = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`cursor-pointer rounded-full px-3.5 py-2 text-sm font-semibold tracking-[0.1px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff244233] disabled:cursor-not-allowed disabled:opacity-60 ${toneClassMap[tone]} ${className}`.trim()}
      {...props}
    />
  )
}
