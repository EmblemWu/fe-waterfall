import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { rafThrottle } from '../../lib/perf'
import type { ContentItem } from '../../types/content'
import { buildMasonryLayout, getVisiblePositions } from './masonry'

interface UseVirtualMasonryOptions {
  items: ContentItem[]
  overscan: number
  minColumnWidth: number
  gap: number
  restoreKey: string
}

export function useVirtualMasonry({
  items,
  overscan,
  minColumnWidth,
  gap,
  restoreKey,
}: UseVirtualMasonryOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(960)
  const [layoutVersion, setLayoutVersion] = useState(0)

  const heightCache = useRef<Map<string, number>>(new Map())

  const onMeasure = useCallback((id: string, height: number) => {
    const previous = heightCache.current.get(id)
    if (previous != null && Math.abs(previous - height) < 2) {
      return
    }
    // Re-layout only when measurement changed materially.
    heightCache.current.set(id, height)
    setLayoutVersion((v) => v + 1)
  }, [])

  useEffect(() => {
    const updateViewport = () => {
      const top = containerRef.current?.getBoundingClientRect().top ?? 0
      setViewportHeight(window.innerHeight - Math.max(0, top))
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  useEffect(() => {
    const next = Number(sessionStorage.getItem(restoreKey) ?? '0')
    if (Number.isFinite(next) && next > 0) {
      window.scrollTo({ top: next })
    }
  }, [restoreKey])

  useEffect(() => {
    const onScroll = rafThrottle(() => {
      setScrollTop(window.scrollY)
      sessionStorage.setItem(restoreKey, String(window.scrollY))
    })

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [restoreKey])

  const layout = useMemo(() => {
    void layoutVersion
    return buildMasonryLayout(items, containerWidth, gap, minColumnWidth, heightCache.current)
  }, [items, containerWidth, gap, minColumnWidth, layoutVersion])

  const visiblePositions = useMemo(
    () =>
      getVisiblePositions(
        layout.positions,
        scrollTop,
        viewportHeight || window.innerHeight,
        overscan,
      ),
    [layout.positions, overscan, scrollTop, viewportHeight],
  )

  return {
    containerRef,
    layout,
    visiblePositions,
    onMeasure,
    scrollTop,
    viewportHeight,
    cacheSize: heightCache.current.size,
  }
}
