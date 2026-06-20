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
  const title = formData.get('title') as string

  if (!title) {
    return NextResponse.redirect(new URL('/dashboard/experiments', req.url))
  }

  // Deactivate any currently active experiments
  await supabase
    .from('experiments')
    .update({ status: 'completed' })
    .eq('user_id', user.id)
    .eq('status', 'active')

  // Create new experiment
  await supabase
    .from('experiments')
    .insert([
      {
        user_id: user.id,
        title,
        duration_days: 5,
        progress: [],
        status: 'active'
      }
    ])

  revalidatePath('/dashboard', 'layout')
  return NextResponse.redirect(new URL('/dashboard/experiments', req.url), { status: 303 })
}
