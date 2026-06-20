import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'ProblemOS',
  },
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user's logs from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: logs, error: dbError } = await supabase
      .from('logs')
      .select('content, category, root_cause, created_at')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (dbError) {
      throw new Error(dbError.message);
    }

    if (!logs || logs.length === 0) {
      return NextResponse.json({ error: 'Not enough data to generate weekly intelligence. Log some problems first!' }, { status: 400 });
    }

    // Format logs for the AI prompt using standard string concatenation
    const logDataStr = logs.map((l) => {
      const d = new Date(l.created_at).toLocaleDateString();
      return "[" + d + "] Problem: \"" + l.content + "\" | Category: " + l.category + " | Root Cause: " + l.root_cause;
    }).join('\n');

    // LAYER 3: AI Weekly Analysis
    const systemPrompt = "You are a personal life analyst.\n" +
      "Analyze the user's problem logs from the past 7 days.\n" +
      "Detect emotional patterns, behavioral triggers, and recurring problems.\n" +
      "Identify what is holding them back the most.\n\n" +
      "Output a strictly formatted JSON object matching this schema:\n" +
      "{\n" +
      "  \"topProblem\": \"string (A short, punchy summary of their biggest issue this week)\",\n" +
      "  \"rootCause\": \"string (The deeper underlying reason for this pattern)\",\n" +
      "  \"behaviorPattern\": \"string (A specific insight, e.g., '72% of your bad days happen after sleeping late.')\",\n" +
      "  \"actionPlan\": [\"string (Realistic, small experiment to try next week)\", \"string\"]\n" +
      "}";

    const userPrompt = "Here is my data for the last 7 days:\n\n" + logDataStr + "\n\nPlease give me my Weekly Intelligence analysis.";

    const response = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2, 
    });

    let aiContent = response.choices[0]?.message?.content || '';
    
    let weeklyInsight;
    try {
      const startIdx = aiContent.indexOf('{');
      const endIdx = aiContent.lastIndexOf('}');
      
      if (startIdx === -1 || endIdx === -1) {
         throw new Error("No JSON object found in response");
      }
      
      const jsonStr = aiContent.substring(startIdx, endIdx + 1);
      weeklyInsight = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI output as JSON:", aiContent);
      throw new Error("AI returned invalid JSON");
    }

    // Save to the database
    const { data: insertedData, error: insertError } = await supabase
      .from('weekly_insights')
      .insert([
        {
          user_id: user.id,
          top_problem: weeklyInsight.topProblem,
          root_cause: weeklyInsight.rootCause,
          behavior_pattern: weeklyInsight.behaviorPattern,
          action_plan: weeklyInsight.actionPlan,
        }
      ])
      .select('id')
      .single();

    if (insertError) {
      console.error('Error saving weekly insight:', insertError);
    }

    // Add the ID to the returned object
    if (insertedData?.id) {
      weeklyInsight.id = insertedData.id;
    }

    return NextResponse.json(weeklyInsight, { status: 200 });

  } catch (error: any) {
    console.error('Error in weekly intelligence route:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
