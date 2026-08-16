import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Allow up to 60 seconds for the function to execute (Vercel free tier limit)
export const maxDuration = 60;

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Meta WhatsApp Cloud API Setup
const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'betterme_secret_token';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || '';

/**
 * Handle Meta Webhook Verification (GET)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
    console.log('Webhook verified successfully!');
    return new Response(challenge, { status: 200 });
  } else {
    return new Response('Forbidden', { status: 403 });
  }
}

/**
 * Handle Incoming WhatsApp Messages (POST)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify this is a WhatsApp status/message payload
    if (body.object !== 'whatsapp_business_account') {
      return new Response('Not a WhatsApp payload', { status: 404 });
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    // If it's just a status update (read/delivered), return 200 to acknowledge
    if (!message || message.type !== 'text') {
      return new Response('OK', { status: 200 });
    }

    // Extract message data
    const fromNumber = message.from; // e.g., '14155551234' (no +)
    const messageText = message.text?.body;

    if (!messageText) {
      return new Response('Unsupported message type', { status: 200 });
    }

    // Process everything immediately. maxDuration=60 allows us up to 60s.
    try {
      // 1. Authenticate user by phone number
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, whatsapp_number')
        .or(`whatsapp_number.eq.${fromNumber},whatsapp_number.eq.+${fromNumber}`)
        .single();

      if (profileError || !profile) {
        console.warn('Phone number not linked to a user. Skipping DB insert, but will still reply.');
      }

      // 2. Process message with AI via OpenRouter
      const openrouter = createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
      });

      const result = await generateObject({
        model: openrouter('openai/gpt-4o-mini'), 
        schema: z.object({
          replyMessage: z.string().describe('The friendly text response to send back to the user via WhatsApp. Keep it concise.'),
          isFoodLog: z.boolean().describe('Whether the user is explicitly logging a meal or food'),
          calories: z.number().nullable().describe('The estimated calories if it is a food log, otherwise null'),
          foodDescription: z.string().nullable().describe('A short description of the food logged')
        }),
        prompt: `You are the BetterMe AI coach. The user sent: "${messageText}"\n\nIf they are logging food, estimate the calories. If they are just chatting, reply normally as an encouraging coach. Keep responses concise for WhatsApp.`,
      });

      const aiData = result.object;
      const { isFoodLog, calories, foodDescription, replyMessage } = aiData;

      // 3. Save to database
      if (isFoodLog && calories) {
        if (profile?.id) {
          await supabase.from('meals').insert({
            user_id: profile.id,
            food_description: foodDescription || 'Logged via WhatsApp',
            calories: calories
          });
        } else {
          console.warn('No user profile found, skipping calorie save to database.');
        }
      } else if (profile?.id) {
        await supabase.from('logs').insert({
          user_id: profile.id,
          content: messageText,
          category: 'whatsapp_chat'
        });
      }

      // 4. Send Meta API reply
      await sendWhatsAppMessage(fromNumber, replyMessage);

    } catch (err) {
      console.error('Task error:', err);
    }

    // Return 200 quickly so Meta knows we received it
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook parsing error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

/**
 * Helper to send messages via Meta Graph API
 */
async function sendWhatsAppMessage(to: string, text: string) {
  if (!META_ACCESS_TOKEN || !META_PHONE_NUMBER_ID) {
    console.error('Missing Meta API credentials in environment variables.');
    return;
  }

  const url = `https://graph.facebook.com/v19.0/${META_PHONE_NUMBER_ID}/messages`;
  
  const payload = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'text',
    text: { body: text },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Failed to send WhatsApp message:', errText);
  } else {
    console.log('WhatsApp message sent successfully to', to);
  }
}
