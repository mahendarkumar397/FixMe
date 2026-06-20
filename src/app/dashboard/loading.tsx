export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-slate-200 rounded-lg mb-4"></div>
        <div className="h-4 w-96 bg-slate-200 rounded-lg"></div>
      </div>

      {/* Quick Stats Grid Skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-200/60 p-6 rounded-[1.5rem] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
            </div>
            <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Main Insight Card Skeleton */}
      <div className="bg-slate-800 rounded-[2rem] p-8 h-64 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-700"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-700 rounded"></div>
            <div className="h-3 w-40 bg-slate-700 rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-3/4 bg-slate-700 rounded"></div>
          <div className="h-4 w-1/2 bg-slate-700 rounded"></div>
        </div>
      </div>

      {/* Interactive AI Problem Solver Section Skeleton */}
      <div className="pt-8 border-t border-slate-200">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4"></div>
        <div className="h-32 w-full bg-slate-200 rounded-2xl"></div>
      </div>
    </div>
  )
}
