import { Activity, Brain, CheckCircle, TrendingUp, Zap } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import ProblemSolverSection from "@/components/ProblemSolverSection"
import WeeklyIntelligenceCard from "@/components/WeeklyIntelligenceCard"
import ConsistencyHeatmap from "@/components/ConsistencyHeatmap"
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: logs } = await supabase
    .from('logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30)

  const { data: experiments } = await supabase
    .from('experiments')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)

  const { data: insights } = await supabase
    .from('weekly_insights')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  const activeExperiment = experiments?.[0]
  const weeklyInsight = insights?.[0]
  
  const safeLogs = logs || []

  // If they have literally no data and no onboarding insight, show empty state
  if (safeLogs.length === 0 && !weeklyInsight) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Welcome to FixMe.</h1>
          <p className="text-slate-500 font-medium">Your journey to self-awareness starts here.</p>
        </div>
        <div className="bg-white border border-slate-200/60 p-12 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] text-center ring-1 ring-slate-900/5">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">No data yet. Let's fix that.</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">
            We need to understand what's going wrong before we can help you fix it. Log your first daily struggle to start identifying patterns.
          </p>
          <Link href="/dashboard/log">
             <button className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md hover:shadow-xl">
               Log your first struggle
             </button>
          </Link>
        </div>
      </div>
    )
  }



  // Derive top problem area dynamically if possible
  const categoryCounts = safeLogs.reduce((acc: any, log: any) => {
    if (log.category && log.category !== 'Uncategorized') {
      acc[log.category] = (acc[log.category] || 0) + 1
    }
    return acc
  }, {})
  
  let topProblemArea = "Need more data"
  const sortedCategories = Object.entries(categoryCounts).sort((a: any, b: any) => b[1] - a[1])
  if (sortedCategories.length > 0) {
    topProblemArea = sortedCategories[0][0]
  } else if (safeLogs.length > 0) {
    topProblemArea = "Analyzing patterns..."
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Welcome back.</h1>
        <p className="text-slate-500 font-medium">Here's what your data is telling us this week.</p>
      </div>

      {/* Full-width Heatmap */}
      <ConsistencyHeatmap logs={safeLogs} />

      {/* Quick Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-8 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-rose-500/20 transition-colors duration-500" />
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100 shadow-inner group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-800 text-xl tracking-tight">Top Problem Area</h3>
          </div>
          <p className="text-3xl font-black text-slate-900 leading-tight tracking-tighter relative z-10">{topProblemArea}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-8 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-colors duration-500" />
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100 shadow-inner group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 fill-amber-500" />
            </div>
            <h3 className="font-black text-slate-800 text-xl tracking-tight">Active Experiment</h3>
          </div>
          {activeExperiment ? (
             <div className="relative z-10">
               <p className="text-2xl font-bold text-slate-900 leading-tight line-clamp-2">{activeExperiment.title}</p>
               <div className="inline-flex mt-4 px-3 py-1 bg-amber-100 text-amber-700 font-bold text-sm rounded-lg uppercase tracking-widest">In Progress</div>
             </div>
          ) : (
             <div className="relative z-10">
               <p className="text-2xl font-bold text-slate-900 leading-tight">No active experiment</p>
               <Link href="/dashboard/insights">
                 <button className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md">
                   Start one now
                 </button>
               </Link>
             </div>
          )}
        </div>
      </div>

      {/* Main Insight Card - Layer 3 Weekly Intelligence / Day 1 Profile */}
      <WeeklyIntelligenceCard initialData={weeklyInsight} logs={safeLogs} />

      {/* Interactive AI Problem Solver Section */}
      <div className="pt-8 border-t border-slate-200">
        <ProblemSolverSection />
      </div>
    </div>
  )
}
