import { ratelimit } from '@/lib/ratelimit';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { categorizeProblem } from '@/lib/ruleEngine';
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
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }

    const { problem } = await req.json();

    if (!problem) {
      return NextResponse.json({ error: 'Problem description is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // LAYER 1: Rule Engine
    let category = categorizeProblem(problem);

    // LAYER 2: AI Analysis
    // We are using double quotes and \n instead of backticks to completely prevent any Next.js parser issues.
    const systemPrompt = "You are an analytical personal life analyst.\n" +
      "Your goal is to understand recurring problems, detect root causes, and suggest realistic, small improvements.\n" +
      "DO NOT act like a motivational therapist. Be practical and specific.\n" +
      "The user will provide a daily problem log.\n\n" +
      "You must output ONLY a valid JSON object matching this exact schema:\n" +
      "{\n" +
      "  \"category\": \"string (must be one of: fitness, sleep, career, money, stress, productivity, relationships, health. If already provided, use it.)\",\n" +
      "  \"rootCause\": \"string (Identify the underlying trigger, e.g. if skipped gym, maybe due to sleep. Focus on WHY.)\",\n" +
      "  \"actionPlan\": [\"string (Realistic, small, measurable improvement)\", \"string\"]\n" +
      "}";

    let categoryNote = "Please determine the best category.";
    if (category) {
      categoryNote = "Note: A rule engine has pre-categorized this as \"" + category + "\". Keep this category unless it is clearly wrong.";
    }
    
    const userPrompt = "User Problem Log: \"" + problem + "\"\n" + categoryNote;

    const response = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1, 
    });

    let aiContent = response.choices[0]?.message?.content || '';
    
    let aiAnalysis;
    try {
      // Extract only the JSON object, ignoring any conversational text before or after
      const startIdx = aiContent.indexOf('{');
      const endIdx = aiContent.lastIndexOf('}');
      
      if (startIdx === -1 || endIdx === -1) {
         throw new Error("No JSON object found in response");
      }
      
      const jsonStr = aiContent.substring(startIdx, endIdx + 1);
      aiAnalysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI output as JSON:", aiContent);
      throw new Error("AI returned invalid JSON");
    }

    // Insert the log into Supabase so it's saved!
    const { error: dbError } = await supabase.from('logs').insert([
      {
        user_id: user.id,
        content: problem,
        category: aiAnalysis.category,
        root_cause: aiAnalysis.rootCause || aiAnalysis.root_cause,
      }
    ]);

    if (dbError) {
      console.error("Database insert error:", dbError);
    }

    return NextResponse.json(aiAnalysis, { status: 200 });

  } catch (error: any) {
    console.error('Error in analyze route:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
