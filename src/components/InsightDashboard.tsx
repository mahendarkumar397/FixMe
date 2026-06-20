'use client';

import { motion } from 'framer-motion';
import { Target, Zap, Activity } from 'lucide-react';

export type AIAnalysisResult = {
  category: string;
  rootCause?: string;
  root_cause?: string;
  actionPlan?: string[];
  action_plan?: string[];
};

export default function InsightDashboard({ latestInsight }: { latestInsight: AIAnalysisResult | null }) {
  if (!latestInsight) {
    return (
      <div className="w-full max-w-3xl mx-auto p-12 border-2 border-dashed border-slate-200/60 rounded-[2rem] flex flex-col items-center justify-center text-center text-slate-400 min-h-[300px] bg-white/40 backdrop-blur-xl">
        <Activity className="w-12 h-12 mb-4 text-slate-300" />
        <p className="text-xl font-bold text-slate-500 tracking-tight">Waiting for data...</p>
        <p className="text-md mt-2 font-medium">Log a problem above to see your personal analysis.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Root Cause Card */}
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] ring-1 ring-slate-900/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target className="w-32 h-32 text-rose-500 translate-x-8 -translate-y-8" />
          </div>
          <div className="relative z-10">
            <p className="text-xs text-rose-500 font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" /> Root Cause
            </p>
            <p className="text-slate-900 text-2xl font-black leading-tight tracking-tight">
              {latestInsight.rootCause || latestInsight.root_cause || "Analyzing..."}
            </p>
          </div>
        </motion.div>

        {/* Category Card */}
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] ring-1 ring-slate-900/5 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute bottom-0 left-0 p-4 opacity-10">
            <Activity className="w-32 h-32 text-amber-500 -translate-x-8 translate-y-8" />
          </div>
          <div className="relative z-10">
            <p className="text-xs text-amber-500 font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Category
            </p>
            <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-lg font-black tracking-tight border border-amber-200 shadow-sm">
              {latestInsight.category}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Action Plan */}
      <motion.div whileHover={{ scale: 1.01 }} className="bg-slate-900 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <p className="text-xs text-amber-400 font-bold tracking-widest uppercase mb-6 flex items-center gap-2 relative z-10">
          <Zap className="w-4 h-4" /> Practical Fixes
        </p>
        
        <ul className="space-y-4 relative z-10">
          {(latestInsight.actionPlan || latestInsight.action_plan || []).map((step, idx) => (
            <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-sm font-bold border border-slate-700 group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors shadow-inner">
                {idx + 1}
              </span>
              <span className="mt-1 text-slate-300 font-medium leading-relaxed text-lg group-hover:text-white transition-colors">{step}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
