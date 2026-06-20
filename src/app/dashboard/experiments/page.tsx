import { createClient } from "@/utils/supabase/server"
import { CheckCircle, Circle, ArrowRight, Zap, Target } from "lucide-react"

export default async function ExperimentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: experiments } = await supabase
    .from('experiments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: insights } = await supabase
    .from('weekly_insights')
    .select('action_plan')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  const hasExperiments = experiments && experiments.length > 0;
  const recommendedPlan = insights?.[0]?.action_plan || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Experiments Engine</h1>
        <p className="text-slate-500 font-medium">Turn insights into action by committing to micro-experiments.</p>
      </div>

      {!hasExperiments && (
        <div className="bg-white border border-slate-200/60 p-8 rounded-[2rem] shadow-sm ring-1 ring-slate-900/5">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 border border-amber-100">
            <Zap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No active experiments.</h2>
          <p className="text-slate-500 mb-8 max-w-2xl leading-relaxed">
            The AI has identified the root causes of your recurring problems. Now it's time to run a 5-day experiment to see if we can fix it. Here are your recommended experiments based on your latest Day 1 Profile:
          </p>

          <div className="space-y-4">
            {recommendedPlan.map((plan: string, idx: number) => (
              <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-indigo-200 transition-colors">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1 flex-shrink-0">
                    <Target className="w-5 h-5 text-indigo-500" />
                  </div>
                  <p className="font-semibold text-slate-700 leading-relaxed">{plan}</p>
                </div>
                <form action="/api/experiments" method="POST">
                  <input type="hidden" name="title" value={plan} />
                  <button type="submit" className="whitespace-nowrap px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors shadow-sm w-full md:w-auto">
                    Start 5-Day Experiment
                  </button>
                </form>
              </div>
            ))}
            
            {recommendedPlan.length === 0 && (
               <p className="text-slate-400 italic">No recommendations available yet. Complete your Day 1 Profile or wait for Weekly Intelligence.</p>
            )}
          </div>
        </div>
      )}

      {hasExperiments && (
        <div className="space-y-6">
          {experiments.map((exp: any) => (
            <div key={exp.id} className="bg-white border border-slate-200/60 p-8 rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] ring-1 ring-slate-900/5 transition-all">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold tracking-widest uppercase mb-3 border border-emerald-100">
                    {exp.status === 'active' ? 'Active' : 'Completed'}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 max-w-2xl leading-tight">{exp.title}</h3>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-700 uppercase tracking-widest text-sm">Progress Tracker</h4>
                  <span className="text-slate-500 text-sm font-medium">Day {(exp.progress || []).length} / {exp.duration_days}</span>
                </div>
                
                <div className="flex gap-3">
                  {Array.from({ length: exp.duration_days }).map((_, i) => {
                    const isCompleted = (exp.progress || [])[i];
                    return (
                      <div key={i} className={`flex-1 aspect-[3/4] rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        isCompleted 
                          ? 'bg-emerald-500 border-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      }`}>
                        <span className={`text-xs font-bold uppercase tracking-widest ${isCompleted ? 'text-emerald-100' : 'text-slate-400'}`}>Day</span>
                        <span className={`text-2xl font-black ${isCompleted ? 'text-white' : 'text-slate-700'}`}>{i + 1}</span>
                      </div>
                    );
                  })}
                </div>

                {exp.status === 'active' && (exp.progress || []).length < exp.duration_days && (
                  <form action="/api/experiments/checkin" method="POST" className="mt-6 flex justify-end">
                    <input type="hidden" name="experiment_id" value={exp.id} />
                    <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-md flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Check in for Day {(exp.progress || []).length + 1}
                    </button>
                  </form>
                )}

                {exp.status === 'active' && (exp.progress || []).length >= exp.duration_days && (
                  <form action="/api/experiments/complete" method="POST" className="mt-6 flex justify-end">
                    <input type="hidden" name="experiment_id" value={exp.id} />
                    <button type="submit" className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md flex items-center gap-2">
                      Mark Experiment Complete <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
