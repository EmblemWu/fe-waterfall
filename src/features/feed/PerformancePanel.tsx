import styles from './PerformancePanel.module.css'

interface PerformancePanelProps {
  rendered: number
  total: number
  cacheSize: number
  overscan?: number
  virtualizationEnabled?: boolean
}

export function PerformancePanel({
  rendered,
  total,
  cacheSize,
  overscan,
  virtualizationEnabled,
}: PerformancePanelProps) {
  return (
    <aside className={styles.panel} aria-live="polite">
      {virtualizationEnabled != null ? (
        <div>Virtualization: {virtualizationEnabled ? 'ON' : 'OFF'}</div>
      ) : null}
      {overscan != null ? <div>Overscan: {overscan}</div> : null}
      <div>Rendered: {rendered}</div>
      <div>Total: {total}</div>
      <div>Height Cache: {cacheSize}</div>
    </aside>
  )
}
