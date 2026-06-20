'use client';

import { useState } from 'react';
import LogEntry from './LogEntry';
import InsightDashboard, { AIAnalysisResult } from './InsightDashboard';

export default function ProblemSolverSection() {
  const [latestInsight, setLatestInsight] = useState<AIAnalysisResult | null>(null);

  return (
    <div className="w-full space-y-12">
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">What went wrong today?</h2>
          <p className="text-slate-500 mt-2">Log the problem. We'll find the root cause and a practical fix.</p>
        </div>
        <LogEntry onLogAnalyzed={(result) => setLatestInsight(result)} />
      </section>

      <section>
        <InsightDashboard latestInsight={latestInsight} />
      </section>
    </div>
  );
}
