import express from "express";
import cors from "cors";
import { TextCloudflareAI, ImageCloudflareAI } from "./ai/cloudflare.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/generate-prompt', async (req, res) => {
  const ai = new TextCloudflareAI('meta/llama-3.2-3b-instruct');
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = await ai.generate({
      system: ['You are an expert at writing detailed image generation prompts. Convert the user message into a detailed prompt that will generate a high-quality image. You will only respond with the prompt, and will not include any other text.'],
      user: [message]
    });

    res.json({ prompt });
  } catch (error) {
    console.error('Error generating prompt:', error);
    res.status(500).json({ error: 'Failed to generate prompt' });
  }
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { model, prompt } = req.body;
    if (!prompt || !model) {
      return res.status(400).json({ error: 'Prompt and model are required' });
    }

    const ai = new ImageCloudflareAI(model);
    const imageStream = await ai.generate(prompt);
    
    res.setHeader('Content-Type', 'image/jpeg');
    imageStream.pipe(res);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
