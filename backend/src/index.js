require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { TextCloudflareAI } = require('./ai/cloudflare');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const textAI = new TextCloudflareAI('@cf/meta/llama-2-7b-chat-int8');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/generate-prompt', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = await textAI.generate({
      system: ['You are an expert at writing detailed image generation prompts. Convert the user message into a detailed prompt that will generate a high-quality image.'],
      user: [message]
    });

    res.json({ prompt });
  } catch (error) {
    console.error('Error generating prompt:', error);
    res.status(500).json({ error: 'Failed to generate prompt' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
