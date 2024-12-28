const Settings = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">API Configuration</h2>
          <input 
            type="password" 
            className="w-full p-2 border rounded"
            placeholder="Claude API Key"
          />
          <input 
            type="password" 
            className="w-full p-2 border rounded"
            placeholder="Image Generation API Key"
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Preferences</h2>
          <select className="w-full p-2 border rounded">
            <option>Stable Diffusion</option>
            <option>Flux</option>
          </select>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;