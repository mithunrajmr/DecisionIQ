/**
 * LoadingSkeleton – shimmer placeholders while data is loading.
 * type: 'card' | 'context' | 'scenario'
 */
export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} type={type} />
      ))}
    </>
  )
}

function SkeletonItem({ type }) {
  if (type === 'context') {
    return (
      <div className="card p-5 space-y-3">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-8 w-16 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
      </div>
    )
  }

  if (type === 'scenario') {
    return (
      <div className="card p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="skeleton h-5 w-36 rounded" />
          <div className="skeleton h-6 w-6 rounded-full" />
        </div>
        {/* Score bar */}
        <div className="skeleton h-2 w-full rounded-full" />
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="skeleton h-14 rounded-xl" />
          <div className="skeleton h-14 rounded-xl" />
        </div>
        {/* Benefits */}
        <div className="space-y-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-5/6 rounded" />
          <div className="skeleton h-3 w-4/6 rounded" />
        </div>
      </div>
    )
  }

  // Default 'card' skeleton
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-4 w-32 rounded" />
      <div className="skeleton h-8 w-20 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-2/3 rounded" />
    </div>
  )
}
