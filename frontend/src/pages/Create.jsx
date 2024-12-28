
import { useState } from 'react';

const Create = () => {
  const [userMessage, setUserMessage] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Image</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <textarea 
            className="w-full h-32 p-4 border rounded-lg"
            placeholder="Generated prompt will appear here..."
            value={generatedPrompt}
            readOnly
          />
          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            setError(null);
            try {
              const response = await fetch('http://0.0.0.0:3000/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  model: e.target.model.value,
                  prompt: generatedPrompt
                }),
              });
              
              if (!response.ok) throw new Error('Failed to generate image');
              
              const blob = await response.blob();
              setGeneratedImage(URL.createObjectURL(blob));
            } catch (err) {
              setError(err.message);
            } finally {
              setIsLoading(false);
            }
          }}>
            <textarea 
              className="w-full h-32 p-4 border rounded-lg mb-4"
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
        <div className="border rounded-lg p-4 flex items-center justify-center min-h-[400px]">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          ) : generatedImage ? (
            <img src={generatedImage} alt="Generated" className="max-w-full max-h-[400px]" />
          ) : (
            <p className="text-gray-500">Generated image will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Create;
