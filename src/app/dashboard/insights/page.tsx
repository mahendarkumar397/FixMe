import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { ArrowLeft, Brain, Zap, FlaskConical } from "lucide-react"

export default async function InsightsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: insights } = await supabase
    .from('weekly_insights')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: experiments } = await supabase
    .from('experiments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 bg-white rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">Insights & Experiments</h1>
          <p className="text-slate-500 font-medium">Deep dive into your patterns and active experiments.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Insights Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
            <Brain className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-slate-800">Weekly Insights</h2>
          </div>
          
          {insights && insights.length > 0 ? (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className="bg-white border border-slate-200/60 p-6 rounded-[1.5rem] shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-slate-800 text-lg">{insight.top_problem}</h3>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                      {new Date(insight.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-4">{insight.behavior_pattern}</p>
                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100/50">
                    <p className="text-sm font-semibold text-indigo-900 mb-2">Root Cause</p>
                    <p className="text-indigo-700 text-sm">{insight.root_cause}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-[1.5rem] p-8 text-center text-slate-500">
              <Brain className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p>No insights generated yet.</p>
              <p className="text-sm mt-1">Keep logging problems and we'll analyze your patterns soon.</p>
            </div>
          )}
        </div>

        {/* Experiments Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
            <FlaskConical className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-slate-800">Experiments</h2>
          </div>

          {experiments && experiments.length > 0 ? (
            <div className="space-y-4">
              {experiments.map((exp) => (
                <div key={exp.id} className="bg-white border border-slate-200/60 p-6 rounded-[1.5rem] shadow-sm relative overflow-hidden">
                  {exp.status === 'active' && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400 rounded-full blur-[50px] opacity-20 translate-x-1/2 -translate-y-1/2" />
                  )}
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{exp.title}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${exp.status === 'active' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                      {exp.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 relative z-10">{exp.description}</p>
                  <div className="flex gap-2">
                     <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        Duration: {exp.duration_days} Days
                     </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-[1.5rem] p-8 text-center text-slate-500">
              <FlaskConical className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p>No active experiments.</p>
              <p className="text-sm mt-1">Experiments will appear here once you start one based on your insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
