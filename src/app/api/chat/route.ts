import { createOpenAI } from '@ai-sdk/openai';
import { streamText, Message } from 'ai';
import { createClient } from '@/utils/supabase/server';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'FixMe OS',
  }
});

// Removed edge runtime as Supabase SSR cookies require Node.js environment in this setup

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // 1. Fetch user context (RAG)
    const [logsResponse, experimentsResponse] = await Promise.all([
      supabase
        .from('logs')
        .select('content, category, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('experiments')
        .select('title, status, duration_days, progress')
        .eq('user_id', user.id)
        .eq('status', 'active')
    ]);

    const recentLogs = logsResponse.data || [];
    const activeExperiments = experimentsResponse.data || [];

    // 2. Build the System Prompt
    let systemPrompt = `You are the FixMe AI Coach, a highly analytical and direct behavioral assistant.
Your goal is to help the user break bad habits by referencing their data. Be concise, practical, and slightly stoic. Do not act like a bubbly therapist.

CONTEXT (The user's recent data):
`;

    if (recentLogs.length > 0) {
      systemPrompt += `\nRECENT LOGS:\n`;
      recentLogs.forEach((log, i) => {
        systemPrompt += `- ${log.category || 'General'}: "${log.content}"\n`;
      });
    }

    if (activeExperiments.length > 0) {
      systemPrompt += `\nACTIVE EXPERIMENTS:\n`;
      activeExperiments.forEach((exp) => {
        const progressCount = (exp.progress || []).length;
        systemPrompt += `- [${progressCount}/${exp.duration_days} days] ${exp.title}\n`;
      });
    }

    systemPrompt += `\nGUIDELINES:
- Directly reference the context provided above if relevant.
- Do not make up past logs.
- Keep responses short and actionable (under 3 paragraphs).
- Format using markdown for readability.`;

    // 3. Stream the response
    const result = await streamText({
      model: openrouter('meta-llama/llama-3.1-8b-instruct'),
      system: systemPrompt,
      messages,
      temperature: 0.3,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error('Error in chat route:', error);
    return new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}
