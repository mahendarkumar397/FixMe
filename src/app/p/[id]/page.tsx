import { createClient } from '@/utils/supabase/server';
import WeeklyIntelligenceCard from '@/components/WeeklyIntelligenceCard';
import Link from 'next/link';
import { Brain } from 'lucide-react';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: insight } = await supabase
    .from('weekly_insights')
    .select('top_problem, behavior_pattern')
    .eq('id', id)
    .single();

  if (!insight) {
    return {
      title: 'ProblemOS Insight',
      description: 'Check out this behavioral insight on ProblemOS.',
    };
  }

  return {
    title: `My Top Problem: ${insight.top_problem} | ProblemOS`,
    description: insight.behavior_pattern,
    openGraph: {
      title: `My Top Problem: ${insight.top_problem}`,
      description: insight.behavior_pattern,
      type: 'article',
      images: [
        {
          url: '/api/og?title=' + encodeURIComponent(insight.top_problem), // Fallback or dynamic later
          width: 1200,
          height: 630,
          alt: 'ProblemOS Insight',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `My Top Problem: ${insight.top_problem}`,
      description: insight.behavior_pattern,
    },
  };
}

export default async function PublicInsightPage({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabase = await createClient();
  const { data: insight, error } = await supabase
    .from('weekly_insights')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !insight) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-slate-200">
          <Brain className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Insight Not Found</h1>
          <p className="text-slate-500 mb-6">This intelligence report may have been deleted or doesn't exist.</p>
          <Link href="/">
            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors w-full">
              Go to ProblemOS
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header / Branding */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">ProblemOS</span>
        </div>

        {/* Insight Card */}
        <WeeklyIntelligenceCard initialData={insight} logs={[]} isPublic={true} />

        {/* CTA */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 text-center shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Want your own Spotify Wrapped for problems?</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Log your daily friction, uncover hidden behavioral patterns, and get AI-generated action plans.
          </p>
          <Link href="/signup">
            <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">
              Start Tracking Free
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
