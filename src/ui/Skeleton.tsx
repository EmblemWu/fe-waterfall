interface SkeletonProps {
  height?: number
}

export function Skeleton({ height = 120 }: SkeletonProps) {
  return (
    <div
      className="w-full animate-pulse rounded-[10px] bg-gradient-to-r from-[#eceff4] via-[#f5f7fa] to-[#eceff4] bg-[length:200%_100%]"
      style={{ height }}
      aria-hidden="true"
    />
  )
}
