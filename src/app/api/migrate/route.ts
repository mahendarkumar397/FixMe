import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get('secret') !== 'betterme_migrate_2024') {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      create table if not exists processed_messages (
        id uuid default gen_random_uuid() primary key,
        message_id text unique not null,
        created_at timestamp with time zone default now()
      );
    `
  });

  if (error) {
    // Try direct insert to check if table already exists
    const { error: insertError } = await supabase
      .from('processed_messages')
      .insert({ message_id: 'test_migration_check_' + Date.now() });
    
    if (insertError && insertError.code === '42P01') {
      return new Response(JSON.stringify({ error: 'Table does not exist and could not be created. Please run SQL manually in Supabase dashboard.', details: error }), { status: 500 });
    }
    return new Response(JSON.stringify({ status: 'Table already exists or was created', insertCheck: insertError }), { status: 200 });
  }

  return new Response(JSON.stringify({ success: true, message: 'processed_messages table created!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
