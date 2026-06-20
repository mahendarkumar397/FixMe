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

    const { area, burnout, roadblock } = await req.json();

    if (!area || !burnout || !roadblock) {
      return NextResponse.json({ error: 'Missing onboarding answers' }, { status: 400 });
    }

    const systemPrompt = "You are an analytical personal life analyst.\n" +
      "The user just joined your program and provided an initial assessment.\n" +
      "Analyze their situation and provide a 'Day 1 Profile'.\n\n" +
      "Output a strictly formatted JSON object matching this schema:\n" +
      "{\n" +
      "  \"topProblem\": \"string (A short, punchy summary of their biggest issue right now)\",\n" +
      "  \"rootCause\": \"string (The deeper underlying reason based on their roadblock)\",\n" +
      "  \"behaviorPattern\": \"string (A specific insight analyzing how their burnout frequency connects to their roadblock)\",\n" +
      "  \"actionPlan\": [\"string (Realistic, small 1-day experiment to start fixing it)\", \"string\"]\n" +
      "}";

    const userPrompt = "Initial Assessment Data:\n" +
      "1. Most stuck area: " + area + "\n" +
      "2. Burnout frequency: " + burnout + "\n" +
      "3. Biggest roadblock: \"" + roadblock + "\"\n\n" +
      "Generate my Day 1 Profile.";

    const response = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2, 
    });

    let aiContent = response.choices[0]?.message?.content || '';
    
    let profileData;
    try {
      const startIdx = aiContent.indexOf('{');
      const endIdx = aiContent.lastIndexOf('}');
      if (startIdx === -1 || endIdx === -1) throw new Error("No JSON object");
      const jsonStr = aiContent.substring(startIdx, endIdx + 1);
      profileData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI output as JSON:", aiContent);
      throw new Error("AI returned invalid JSON");
    }

    // Save as their first "weekly insight" so it populates the dashboard immediately
    const { error: insertError } = await supabase
      .from('weekly_insights')
      .insert([
        {
          user_id: user.id,
          top_problem: profileData.topProblem || profileData.top_problem,
          root_cause: profileData.rootCause || profileData.root_cause,
          behavior_pattern: profileData.behaviorPattern || profileData.behavior_pattern,
          action_plan: profileData.actionPlan || profileData.action_plan,
        }
      ]);

    if (insertError) {
      console.error('Error saving onboarding insight:', insertError);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('Error in onboarding route:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
