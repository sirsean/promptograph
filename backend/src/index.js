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

const STYLES = {
  'cyberpunk': 'Your preferred art style is cyberpunk line drawings. You produce 2D illustrations.',
  'icon': 'Your preferred art style is iconography. You produce flat 2D images that can be used as an icon.',
  'pixel': 'Your preferred art style is pixel art. You produce 2D pixel art.',
  'anime': 'Your preferred art style is anime. You produce 2D anime art.',
  'calligraphy': `Your preferred art style is artistic compositions in a minimalist calligraphy painting style. For any user request, generate prompts that follow these principles:

**Visual Style:**
- Traditional ink wash technique with bold, confident brushstrokes
- Sumi-e inspired composition with asymmetrical layout
- 60-80% negative space with deliberate emptiness
- Monochromatic palette (primarily black ink) with minimal color accents
- Clean, flowing linework that suggests rather than details

**Emotional Tone:**
- Evoke contrasting emotions: optimism paired with loneliness, hope with melancholy
- Create contemplative, meditative atmosphere
- Suggest infinite space and profound silence
- Convey universal human experiences through environmental elements

**Temporal Fusion:**
- Blend ancient and futuristic elements seamlessly
- Transform traditional forms into modern/technological counterparts
- Create bridges between past and future through visual metaphor

**Composition Rules:**
- Focus on architectural, natural, or abstract elements only
- No anthropomorphic characters or figures
- No symbols or text
- Use single brushstrokes to suggest larger forms (mountains, horizons, structures)
- Employ golden hour or dramatic lighting for emotional impact
- Include floating, dissolving, or transforming elements

Always interpret the user's request through this aesthetic lens, translating their concept into this specific artistic style while maintaining the core emotional and temporal contrasts.`,
};

app.post('/api/generate-prompt', async (req, res) => {
  const ai = new TextCloudflareAI('meta/llama-3.3-70b-instruct-fp8-fast');
  try {
    const { message, style } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const promptStyle = STYLES[style] || '';

    const systemPrompt = `You are an expert at writing detailed image generation prompts. Convert the user message into a detailed prompt that will generate a high-quality image. You will only respond with the prompt, and will not include any other text. The prompt should not be wrapped in quotation marks, just the raw prompt text. ${promptStyle}`;

    console.log(systemPrompt);
    console.log(message);

    const prompt = await ai.generate({
      system: [systemPrompt],
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
  app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
