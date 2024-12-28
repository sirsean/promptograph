
import { useState } from 'react';

const Create = () => {
  const [userMessage, setUserMessage] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
          <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg">
            Generate Image
          </button>
        </div>
        <div className="border rounded-lg p-4 flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500">Generated image will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default Create;
