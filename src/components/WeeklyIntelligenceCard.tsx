'use client';

import { useState } from 'react';
import { Brain, CheckCircle, Loader2, Activity, Target, Zap, Share2, Check } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { motion } from 'framer-motion';

export type WeeklyInsightData = {
  id?: string;
  top_problem: string;
  root_cause: string;
  behavior_pattern: string;
  action_plan: string[];
};

export default function WeeklyIntelligenceCard({ initialData, logs = [], isPublic = false }: { initialData?: WeeklyInsightData | null, logs?: any[], isPublic?: boolean }) {
  const [data, setData] = useState<WeeklyInsightData | null>(initialData || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    if (!data?.id) return;
    const url = `${window.location.origin}/p/${data.id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const generateIntelligence = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/weekly-intelligence', { method: 'POST' });
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to generate insights');
      }

      setData({
        id: result.id,
        top_problem: result.topProblem || result.top_problem,
        root_cause: result.rootCause || result.root_cause,
        behavior_pattern: result.behaviorPattern || result.behavior_pattern,
        action_plan: result.actionPlan || result.action_plan,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate real metrics from the logs data
  const categoryCounts = logs.reduce((acc, log) => {
    const cat = log.category || 'other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryCounts).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count: count as number
  })).sort((a, b) => b.count - a.count);

  const totalProblems = logs.length;
  const topCategory = chartData.length > 0 ? chartData[0].name : 'N/A';

  if (!data) {
    return (
      <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden border border-indigo-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <Brain className="w-12 h-12 text-indigo-400" />
          <h3 className="text-2xl font-semibold">Weekly Intelligence Ready</h3>
          <p className="text-slate-400 max-w-md">
            We've collected enough data to analyze your behavioral patterns and uncover hidden root causes.
          </p>
          <button
            onClick={generateIntelligence}
            disabled={isGenerating}
            className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Patterns...</>
            ) : (
              'Generate My Spotify Wrapped for Problems'
            )}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] ring-1 ring-slate-900/5 relative hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 opacity-80" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />

      <div className="p-8 pb-0 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg border border-slate-800">
            <Brain className="w-7 h-7 text-amber-400" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Weekly Intelligence</h2>
            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mt-1">Your Pattern Revealed</p>
          </div>
        </div>
        {data.id && !isPublic && (
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors shadow-sm border border-indigo-100"
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {isCopied ? "Copied!" : "Share Pattern"}
          </button>
        )}
      </div>

      <div className="p-8 space-y-8 relative z-10">
        <motion.div whileHover={{ scale: 1.01 }} className="bg-[#FDFBF7] rounded-[1.5rem] p-8 border border-slate-200 shadow-inner">
          <p className="text-2xl font-bold leading-[1.4] text-slate-800 tracking-tight mb-6">
            {data.behavior_pattern}
          </p>
          <div className="flex items-start gap-3 pt-6 border-t border-slate-200/60">
            <Target className="w-5 h-5 text-rose-500 mt-1 flex-shrink-0" />
            <p className="text-slate-600 font-medium leading-relaxed">
              <span className="font-bold text-slate-900">Root Cause:</span> {data.root_cause}
            </p>
          </div>
        </motion.div>

        {!isPublic && (
          <div className="grid grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-[1.5rem] p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                Problems Logged
              </span>
              <span className="text-4xl font-black text-slate-900">{totalProblems}</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-[1.5rem] p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Top Category
              </span>
              <span className="text-2xl font-bold text-slate-900 truncate">
                {chartData.length > 0 ? chartData[0].name : "N/A"}
              </span>
            </motion.div>
          </div>
        )}

        {chartData.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-slate-900 mb-6 text-sm uppercase tracking-widest">Problem Breakdown</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Occurrences">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#818cf8' : '#475569'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Action Plan */}
        <motion.div whileHover={{ scale: 1.01 }} className="bg-slate-900 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-slate-800 relative overflow-hidden flex flex-col gap-6 mt-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 shadow-inner">
              <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
            </div>
            <h4 className="font-black text-white text-2xl tracking-tight">Suggested Action Plan</h4>
          </div>
          
          <ul className="space-y-4 relative z-10">
            {data.action_plan?.map((step, i) => (
              <li key={i} className="flex items-start gap-4 p-5 rounded-2xl hover:bg-white/5 transition-colors group">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-emerald-400 font-black text-sm shrink-0 border border-slate-700 group-hover:bg-emerald-400 group-hover:text-slate-900 transition-colors shadow-inner">
                  {i + 1}
                </span>
                <span className="text-slate-300 font-medium leading-relaxed text-lg group-hover:text-white transition-colors">{step}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}
