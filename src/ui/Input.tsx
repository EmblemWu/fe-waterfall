import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  const input = (
    <input
      id={id}
      className={`min-w-0 rounded-full border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus-visible:border-[#ff9bab] focus-visible:ring-2 focus-visible:ring-[#ff244233] ${className}`.trim()}
      {...props}
    />
  )

  if (!label) {
    return input
  }

  return (
    <label className="flex flex-col gap-1.5 text-[13px] text-[var(--text-muted)]" htmlFor={id}>
      <span>{label}</span>
      {input}
    </label>
  )
}
