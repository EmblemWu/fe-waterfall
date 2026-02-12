import type { InputHTMLAttributes } from 'react'

import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  const input = <input id={id} className={`${styles.input} ${className}`.trim()} {...props} />
  if (!label) {
    return input
  }
  return (
    <label className={styles.label} htmlFor={id}>
      <span>{label}</span>
      {input}
    </label>
  )
}
