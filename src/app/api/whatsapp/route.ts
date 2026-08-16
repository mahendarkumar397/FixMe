import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { after } from 'next/server';

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

// Global in-memory logger for debugging
const requestLogs: any[] = [];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  // If asking for logs
  if (url.searchParams.get('logs') === 'true') {
    return new Response(JSON.stringify(requestLogs, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  } else {
    return new Response('Forbidden', { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    requestLogs.push({ time: new Date().toISOString(), body: bodyText });
    // Keep only last 20 logs
    if (requestLogs.length > 20) requestLogs.shift();
    
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      await sendWhatsAppMessage('916369609721', "DEBUG: Failed to parse JSON: " + bodyText);
      return new Response('Bad Request', { status: 400 });
    }

    // DEBUG: SEND RAW BODY TEXT TO USER
    await sendWhatsAppMessage('916369609721', "RAW PAYLOAD FROM META:\n" + bodyText.substring(0, 800));

    if (body.object !== 'whatsapp_business_account') {
      return new Response('Not a WhatsApp payload', { status: 404 });
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message || message.type !== 'text') {
      return new Response('OK', { status: 200 });
    }

    const fromNumber = message.from;
    const messageText = message.text?.body;

    if (!messageText) {
      return new Response('OK', { status: 200 });
    }

    // Schedule the heavy lifting to happen AFTER the response is sent.
    // This allows us to return 200 OK to Meta instantly without freezing the Vercel isolate.
    after(async () => {
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
        console.error('Background task error:', err);
      }
    });

    // Instantly return 200 OK so Meta doesn't drop the connection
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook parsing error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

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
