import styles from './PerformancePanel.module.css'

interface PerformancePanelProps {
  rendered: number
  total: number
  cacheSize: number
}

export function PerformancePanel({ rendered, total, cacheSize }: PerformancePanelProps) {
  return (
    <aside className={styles.panel} aria-live="polite">
      <div>Rendered: {rendered}</div>
      <div>Total: {total}</div>
      <div>Height Cache: {cacheSize}</div>
    </aside>
  )
}
