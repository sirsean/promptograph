import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import { TextCloudflareAI, ImageCloudflareAI } from "./ai/cloudflare.js";
import { uploadImage, getObject } from "./data/r2.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      system: ['You are an expert at writing detailed image generation prompts. Convert the user message into a detailed prompt that will generate a high-quality image. You will only respond with the prompt, and will not include any other text. The prompt should not be wrapped in quotation marks, just the raw prompt text.'],
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

    const id = crypto.randomUUID();
    
    console.log(id, model, prompt);

    const ai = new ImageCloudflareAI(model);
    let imageData = await ai.generate(`${prompt} (${id})`);

    // Handle Flux model's JSON response
    if (model === 'black-forest-labs/flux-1-schnell') {
      const text = await new Response(imageData).text();
      const response = JSON.parse(text);
      imageData = Buffer.from(response.result.image, 'base64');
    }

    await uploadImage(id, imageData);
    
    res.json({ id });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

app.get('/api/image/:id.png', async (req, res) => {
  try {
    const { id } = req.params;
    const imageObject = await getObject(`prompts/${id}/image.png`);
    res.setHeader('Content-Type', 'image/png');
    imageObject.Body.pipe(res);
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(404).json({ error: 'Image not found' });
  }
});

// set up the UI server
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
if (process.env.NODE_ENV === "production") {
  // serve static files from vite-app
  app.use(express.static(path.join(__dirname, '..', '..', 'dist')));

  // handle all other routes within vite-app
  app.get('*', asyncHandler(async (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
  }));
}

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
