'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'ProblemOS',
  },
})

export async function createDailyLog(formData: {
  problemDescription: string
  mood: number
  energy: number
  sleepHours: number
}) {
  const supabase = await createClient()

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('You must be logged in to save a log.')
  }

  let category = 'Uncategorized'
  let root_cause = 'Needs more context'

  try {
    const systemPrompt = `You are a diagnostic AI for a habit tracking app. 
Analyze the user's daily struggle and extract the primary category and a concise root cause.
Output a strictly formatted JSON object:
{
  "category": "string (e.g., 'Fitness', 'Sleep', 'Focus', 'Diet')",
  "root_cause": "string (a short 5-10 word explanation)"
}`

    const userPrompt = `Problem: "${formData.problemDescription}"\nMood (1-3): ${formData.mood}\nEnergy (1-3): ${formData.energy}\nSleep: ${formData.sleepHours}h`

    const response = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
    })

    let aiContent = response.choices[0]?.message?.content || ''
    aiContent = aiContent.replace(/```json/g, '').replace(/```/g, '').trim()

    try {
      const parsed = JSON.parse(aiContent)
      if (parsed.category) category = parsed.category
      if (parsed.root_cause) root_cause = parsed.root_cause
    } catch (e) {
      console.error("Failed to parse AI output:", aiContent)
    }
  } catch (e) {
    console.error("Failed to fetch AI insights:", e)
  }

  // Insert the log
  const { error } = await supabase
    .from('logs')
    .insert({
      user_id: user.id,
      content: formData.problemDescription,
      mood: formData.mood,
      energy: formData.energy,
      sleep_hours: formData.sleepHours,
      category,
      root_cause,
    })

  if (error) {
    console.error('Failed to insert log:', error)
    throw new Error('Failed to save your log. Please try again.')
  }

  // Revalidate dashboard data
  revalidatePath('/dashboard')
  
  return { success: true }
}
