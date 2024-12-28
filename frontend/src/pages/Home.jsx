import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Promptograph</h1>
      <p className="text-xl mb-8">
        Transform your ideas into images using AI-powered prompt engineering
      </p>
      <Link 
        to="/create" 
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        Start Creating
      </Link>
    </div>
  );
};

export default Home;