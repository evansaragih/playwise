import clsx from 'clsx'

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('skeleton', className)} />
}

export function HomeScreenSkeleton() {
  return (
    <div className="px-4 pt-6 space-y-5 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      {/* Search */}
      <Skeleton className="h-12 w-full rounded-2xl" />
      {/* Activity streak */}
      <Skeleton className="h-28 w-full rounded-2xl" />
      {/* Section header */}
      <div className="flex justify-between">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-14" />
      </div>
      {/* Pending card */}
      <Skeleton className="h-52 w-full rounded-2xl" />
      {/* Sports row */}
      <div className="flex gap-3">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 flex-1 rounded-2xl" />)}
      </div>
      {/* Monthly spend */}
      <Skeleton className="h-20 w-full rounded-2xl" />
      {/* Upcoming */}
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  )
}

export function DiscoverSkeleton() {
  return (
    <div className="px-4 pt-6 space-y-4 animate-pulse">
      <Skeleton className="h-7 w-44" />
      <Skeleton className="h-12 w-full rounded-2xl" />
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-20 rounded-full" />)}
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden">
          <Skeleton className="h-44 w-full" />
          <div className="p-3 space-y-2" style={{ background: '#20201F' }}>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
            <div className="flex justify-between pt-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function GamesSkeleton() {
  return (
    <div className="px-4 pt-6 space-y-4 animate-pulse">
      <Skeleton className="h-7 w-36" />
      <div className="flex gap-3">
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-36 w-full rounded-2xl" />
      ))}
    </div>
  )
}

export function InsightsSkeleton() {
  return (
    <div className="px-4 pt-6 space-y-4 animate-pulse">
      <Skeleton className="h-7 w-44" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-36 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
      <Skeleton className="h-52 w-full rounded-2xl" />
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="px-4 pt-6 space-y-5 animate-pulse">
      <div className="flex flex-col items-center gap-3 py-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
      </div>
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  )
}
