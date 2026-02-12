import type { ButtonHTMLAttributes } from 'react'

import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'primary' | 'ghost' | 'danger'
}

export function Button({ tone = 'primary', className = '', ...props }: ButtonProps) {
  return <button className={`${styles.button} ${styles[tone]} ${className}`.trim()} {...props} />
}
