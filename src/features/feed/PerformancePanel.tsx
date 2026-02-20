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
    <aside
      className="fixed bottom-3 right-3 z-30 rounded-xl bg-black/80 px-3 py-2 text-xs text-white"
      aria-live="polite"
    >
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
