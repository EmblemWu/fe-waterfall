import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'primary' | 'ghost' | 'danger'
}

const toneClassMap: Record<NonNullable<ButtonProps['tone']>, string> = {
  primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]',
  ghost: 'border border-[var(--border)] bg-white text-[var(--text)] hover:bg-[#f8f8f8]',
  danger: 'border border-[#ffd8de] bg-[#fff0f2] text-[var(--accent)] hover:bg-[#ffe7ec]',
}

export function Button({ tone = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`cursor-pointer rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${toneClassMap[tone]} ${className}`.trim()}
      {...props}
    />
  )
}
