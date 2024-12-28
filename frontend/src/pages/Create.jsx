
import { useState } from 'react';

const Create = () => {
  const [userMessage, setUserMessage] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageHistory, setImageHistory] = useState([]);

  const handleGeneratePrompt = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }

      const data = await response.json();
      setGeneratedPrompt(data.prompt);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Image</h1>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleGeneratePrompt}>
            <textarea 
              className="w-full h-32 p-4 border rounded-lg mb-4"
              placeholder="Describe what you want to create..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              required
            />
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-lg text-white 
                ${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isLoading ? 'Generating...' : 'Generate Prompt'}
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
              defaultValue="bytedance/stable-diffusion-xl-lightning"
            >
              <option value="bytedance/stable-diffusion-xl-lightning">Stable Diffusion XL Lightning</option>
              <option value="black-forest-labs/flux-1-schnell">Flux-1 Schnell</option>
            </select>
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-lg text-white 
                ${isLoading ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isLoading ? 'Generating Image...' : 'Generate Image'}
            </button>
          </form>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Generated Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imageHistory.map((image) => (
              <div key={image.id} className="border rounded-lg p-4">
                <img 
                  src={`/api/image/${image.id}.png`} 
                  alt={image.prompt} 
                  className="w-full h-128 object-cover rounded-lg mb-2"
                />
                <p className="text-sm text-gray-600 line-clamp-2">{image.prompt}</p>
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
