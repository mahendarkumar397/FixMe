import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { reportHtml, subject = "Your FixMe OS Weekly Intelligence Report" } = body;

    if (!reportHtml) {
      return NextResponse.json({ error: 'Missing report content' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'FixMe OS <onboarding@resend.dev>',
      to: user.email,
      subject: subject,
      html: reportHtml,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
