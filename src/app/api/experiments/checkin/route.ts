import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const formData = await req.formData()
  const experiment_id = formData.get('experiment_id') as string

  if (!experiment_id) {
    return NextResponse.redirect(new URL('/dashboard/experiments', req.url))
  }

  // Fetch current progress
  const { data: experiment } = await supabase
    .from('experiments')
    .select('progress')
    .eq('id', experiment_id)
    .single()

  if (experiment) {
    const currentProgress = experiment.progress || []
    currentProgress.push(new Date().toISOString()) // Add check-in date

    await supabase
      .from('experiments')
      .update({ progress: currentProgress })
      .eq('id', experiment_id)
  }

  revalidatePath('/dashboard', 'layout')
  return NextResponse.redirect(new URL('/dashboard/experiments', req.url), { status: 303 })
}
