'use client';

import { Activity, Flame } from 'lucide-react';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ConsistencyHeatmap({ logs = [] }: { logs: any[] }) {
  // Generate the last 28 days (4 weeks)
  const heatmapData = useMemo(() => {
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create a map of dates to log counts
    const logCountsByDate = logs.reduce((acc, log) => {
      const dateStr = new Date(log.created_at).toDateString();
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Go backwards 28 days
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      data.push({
        date: d,
        count: logCountsByDate[dateStr] || 0,
      });
    }

    return data;
  }, [logs]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-slate-100/50 border border-slate-200';
    if (count === 1) return 'bg-amber-200 border border-amber-300';
    if (count === 2) return 'bg-amber-400 border border-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.3)]';
    if (count === 3) return 'bg-rose-400 border border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]';
    return 'bg-indigo-500 border border-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]'; // 4+
  };

  const totalLogs = logs.length;
  const weeks = [0, 1, 2, 3];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] ring-1 ring-slate-900/5 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.1, rotate: -5 }} className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-200 shadow-sm">
            <Activity className="w-6 h-6 text-amber-500" />
          </motion.div>
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">Consistency Matrix</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Last 28 Days</p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 shadow-sm">
          <Flame className="w-4 h-4 text-rose-500" />
          <span className="text-rose-700 font-bold text-sm tracking-tight">{totalLogs} Total Logs</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* We have 28 days, let's display them in 4 rows of 7 */}
        {weeks.map((weekIndex) => (
          <div key={weekIndex} className="flex gap-2 justify-between">
            {heatmapData.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, i) => {
              return (
                <div 
                  key={i} 
                  title={`${day.count} logs on ${day.date.toLocaleDateString()}`}
                  className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${getColor(day.count)}`}
                >
                  {day.count > 0 && <span className="text-[10px] font-bold opacity-70">{day.count}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200/60">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          {weeks.length} Weeks Activity
        </span>
        
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span>Less</span>
          <div className="w-3 h-3 rounded bg-slate-100/50 border border-slate-200" />
          <div className="w-3 h-3 rounded bg-amber-200 border border-amber-300" />
          <div className="w-3 h-3 rounded bg-amber-400 border border-amber-500" />
          <div className="w-3 h-3 rounded bg-rose-400 border border-rose-500" />
          <div className="w-3 h-3 rounded bg-indigo-500 border border-indigo-600" />
          <span>More</span>
        </div>
      </div>
    </motion.div>
  );
}
