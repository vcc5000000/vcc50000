import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const PROMPT_ID = process.env.OPENAI_PROMPT_ID || 'pmpt_6a0bb18ce2dc8197ad1c36a0c7812f020dea6ea8c9eba53b';
const PROMPT_VERSION = process.env.OPENAI_PROMPT_VERSION || '1';

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function extractOutputText(response) {
  if (response.output_text) return response.output_text;

  const parts = [];
  for (const item of response.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && content.text) {
        parts.push(content.text);
      }
    }
  }

  return parts.join('\n').trim();
}

app.post('/api/vcc-agent', async (req, res) => {
  try {
    const { message, profile, profileSummary, previousResponseId } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY on the server.' });
    }

    const websiteContext = [
      profileSummary ? `Investor profile selected on website: ${profileSummary}` : '',
      profile ? `Raw profile JSON: ${JSON.stringify(profile)}` : ''
    ].filter(Boolean).join('\n');

    const input = [
      websiteContext,
      `User message: ${message}`
    ].filter(Boolean).join('\n\n');

    const responsePayload = {
      prompt: {
        id: PROMPT_ID,
        version: PROMPT_VERSION
      },
      input
    };

    if (previousResponseId) {
      responsePayload.previous_response_id = previousResponseId;
    }

    const response = await client.responses.create(responsePayload);
    const reply = extractOutputText(response) || 'The assistant did not return text. Please try again.';

    res.json({
      reply,
      response_id: response.id
    });
  } catch (error) {
    console.error('OpenAI agent error:', error);
    res.status(500).json({
      error: error.message || 'Error calling the OpenAI agent.'
    });
  }
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`VCC50000 site running at http://localhost:${port}`);
});
