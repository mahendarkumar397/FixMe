import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { after } from 'next/server';

export const maxDuration = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'betterme_secret_token';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || '';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  if (body.object !== 'whatsapp_business_account') {
    return new Response('Not a WhatsApp payload', { status: 404 });
  }

  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  // Only process text messages, ignore status updates and other events
  if (!message || message.type !== 'text') {
    return new Response('OK', { status: 200 });
  }

  const fromNumber: string = message.from;
  const messageText: string = message.text?.body;
  const messageId: string = message.id;

  if (!messageText) {
    return new Response('OK', { status: 200 });
  }

  // Return 200 OK to Meta instantly, process AI in background
  after(async () => {
    try {
      // Deduplication: skip if we already processed this message ID
      try {
        const { data: existing } = await supabase
          .from('processed_messages')
          .select('id')
          .eq('message_id', messageId)
          .single();

        if (existing) {
          console.log('Duplicate message, skipping:', messageId);
          return;
        }
        await supabase.from('processed_messages').insert({ message_id: messageId });
      } catch {
        // Table may not exist yet — proceed without deduplication
      }

      // Look up user profile by phone number
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, whatsapp_number')
        .or(`whatsapp_number.eq.${fromNumber},whatsapp_number.eq.+${fromNumber}`)
        .single();

      // Generate AI response
      const openrouter = createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
      });

      const result = await generateObject({
        model: openrouter('openai/gpt-4o-mini'),
        schema: z.object({
          replyMessage: z.string().describe('The friendly text response to send back via WhatsApp. Keep it concise.'),
          isFoodLog: z.boolean().describe('Whether the user is explicitly logging a meal or food'),
          calories: z.number().nullable().describe('Estimated calories if food log, otherwise null'),
          foodDescription: z.string().nullable().describe('Short description of food logged'),
        }),
        prompt: `You are the BetterMe AI health coach. The user sent: "${messageText}"\n\nIf they are logging food, estimate the calories. If they are just chatting, reply as an encouraging coach. Keep responses concise for WhatsApp.`,
      });

      const { isFoodLog, calories, foodDescription, replyMessage } = result.object;

      // Save to database if user is linked
      if (profile?.id) {
        if (isFoodLog && calories) {
          await supabase.from('meals').insert({
            user_id: profile.id,
            food_description: foodDescription || 'Logged via WhatsApp',
            calories,
          });
        } else {
          await supabase.from('logs').insert({
            user_id: profile.id,
            content: messageText,
            category: 'whatsapp_chat',
          });
        }
      }

      // Send reply
      await sendWhatsAppMessage(fromNumber, replyMessage);
    } catch (err) {
      console.error('WhatsApp background processing error:', err);
    }
  });

  return new Response('OK', { status: 200 });
}

async function sendWhatsAppMessage(to: string, text: string) {
  if (!META_ACCESS_TOKEN || !META_PHONE_NUMBER_ID) {
    console.error('Missing Meta API credentials');
    return;
  }

  const res = await fetch(`https://graph.facebook.com/v19.0/${META_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  });

  if (!res.ok) {
    console.error('Failed to send WhatsApp message:', await res.text());
  }
}
