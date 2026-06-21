require('dotenv').config({ path: '.env.local' });
const { createOpenAI } = require('@ai-sdk/openai');
const { streamText } = require('ai');

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'FixMe OS',
  }
});

async function main() {
  try {
    const result = await streamText({
      model: openrouter('meta-llama/llama-3.1-8b-instruct'),
      messages: [{ id: '123', role: 'user', content: 'hi' }],
      temperature: 0.3,
    });

    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
    }
    console.log('\nDone.');
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
