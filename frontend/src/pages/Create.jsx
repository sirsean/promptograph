const Create = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Image</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <textarea 
            className="w-full h-32 p-4 border rounded-lg"
            placeholder="Describe what you want to create..."
          />
          <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg">
            Generate Prompt
          </button>
          <textarea 
            className="w-full h-32 p-4 border rounded-lg"
            placeholder="Generated prompt will appear here..."
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