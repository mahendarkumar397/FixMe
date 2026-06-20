'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain } from 'lucide-react';

export default function LogEntry({ onLogAnalyzed }: { onLogAnalyzed: (result: any) => void }) {
  const [problem, setProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      });

      if (!res.ok) throw new Error('Failed to analyze problem');
      
      const data = await res.json();
      onLogAnalyzed(data);
      setProblem('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] ring-1 ring-slate-900/5 relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 opacity-80" />
      
      <div className="p-8 pb-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Brain className="w-6 h-6 text-amber-500" />
          Log a Problem
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-8 pt-2 flex flex-col gap-6 relative group">
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-200 via-rose-200 to-indigo-200 rounded-[2rem] blur-xl opacity-20 group-focus-within:opacity-60 transition duration-500"></div>
          <textarea
            className="relative w-full bg-white border-2 border-slate-100 rounded-[1.5rem] p-6 text-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-300 focus:ring-4 focus:ring-amber-400/20 transition-all resize-none min-h-[150px] font-medium shadow-sm"
            placeholder="E.g. Skipped gym today, felt completely drained after work..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        {error && <p className="text-red-500 font-bold px-4">{error}</p>}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading || !problem.trim()}
          className="self-end px-8 py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Analyze Log
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
