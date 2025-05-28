
import { useState } from 'react';

const Create = () => {
  const [userMessage, setUserMessage] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageHistory, setImageHistory] = useState([]);

  const handleGeneratePrompt = async (e) => {
    e.preventDefault();
    setIsPromptLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          style: e.target.style.value
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }

      const data = await response.json();
      setGeneratedPrompt(data.prompt);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPromptLoading(false);
    }
  };

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    setIsImageLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: e.target.model.value,
          prompt: generatedPrompt
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate image');
      
      const { id } = await response.json();
      const newImage = { id, prompt: generatedPrompt, timestamp: new Date().toISOString() };
      setImageHistory(prev => [newImage, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleGeneratePrompt}>
            <textarea 
              className="w-full h-64 p-4 border rounded-lg mb-4"
              placeholder="Describe what you want to create..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              required
            />
            <select 
              name="style"
              className="w-full p-2 border rounded-lg mb-4"
              defaultValue=""
            >
              <option value="">Select style (optional)</option>
              <option value="cyberpunk">Cyberpunk</option>
              <option value="icon">Icon</option>
              <option value="pixel">Pixel Art</option>
              <option value="anime">Anime</option>
              <option value="calligraphy">Calligraphy</option>
            </select>
            <button 
              type="submit"
              disabled={isPromptLoading}
              className={`w-full px-4 py-2 rounded-lg text-cyberpunk button-cyberpunk
                ${isPromptLoading ? 'opacity-50' : ''}`}
            >
              {isPromptLoading ? 'Generating...' : 'Generate Prompt'}
            </button>
          </form>
          
          <form onSubmit={handleGenerateImage}>
            <textarea 
              className="w-full h-64 p-4 border rounded-lg mb-4"
              value={generatedPrompt}
              onChange={(e) => setGeneratedPrompt(e.target.value)}
              placeholder="Edit the generated prompt if needed..."
              required
            />
            <select 
              name="model"
              className="w-full p-2 border rounded-lg mb-4"
              defaultValue="black-forest-labs/flux-1-schnell"
            >
              <option value="black-forest-labs/flux-1-schnell">Flux-1 Schnell</option>
              <option value="bytedance/stable-diffusion-xl-lightning">Stable Diffusion XL Lightning</option>
            </select>
            <button 
              type="submit"
              disabled={isImageLoading}
              className={`w-full px-4 py-2 rounded-lg text-cyberpunk 
                ${isImageLoading ? 'button-cyberpunk-300 opacity-50' : 'button-cyberpunk-500 hover:button-cyberpunk-600'}`}
            >
              {isImageLoading ? 'Generating Image...' : 'Generate Image'}
            </button>
          </form>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {isImageLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyberpunk-500"></div>
          </div>
        )}

        <div className="space-y-6">
          {imageHistory.length > 0 && (
            <div className="mb-8">
              <div className="border rounded-lg p-4">
                <a href={`/api/image/${imageHistory[0].id}.png`} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={`/api/image/${imageHistory[0].id}.png`} 
                    alt={imageHistory[0].prompt} 
                    className="w-full object-cover rounded-lg mb-2"
                  />
                </a>
                <p className="text-sm text-cyberpunk-600">{imageHistory[0].prompt}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(imageHistory[0].timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imageHistory.slice(1).map((image) => (
              <div key={image.id} className="border rounded-lg p-4">
                <a href={`/api/image/${image.id}.png`} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={`/api/image/${image.id}.png`} 
                    alt={image.prompt} 
                    className="w-full h-128 object-cover rounded-lg mb-2"
                  />
                </a>
                <p className="text-sm text-cyberpunk-600 line-clamp-2">{image.prompt}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(image.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
