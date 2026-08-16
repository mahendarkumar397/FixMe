const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'betterme_secret_token';

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

    // If it's just a status update (read/delivered) or unsupported, return 200
    if (!message || message.type !== 'text') {
      return new Response('OK', { status: 200 });
    }

    // Extract message data
    const fromNumber = message.from; // e.g., '14155551234' (no +)
    const messageText = message.text?.body;

    if (!messageText) {
      return new Response('OK', { status: 200 });
    }

    // Fetch the absolute URL for the worker (we construct it dynamically to support local dev and Vercel)
    const url = new URL(req.url);
    const workerUrl = `${url.protocol}//${url.host}/api/whatsapp/worker`;

    // Fire-and-forget: Trigger the background worker route.
    // We intentionally DO NOT await this fetch so that we can return 200 OK instantly.
    fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fromNumber, messageText }),
    }).catch(err => {
      console.error('Failed to trigger background worker:', err);
    });

    // Return 200 quickly so Meta knows we received it instantly
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook parsing error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
