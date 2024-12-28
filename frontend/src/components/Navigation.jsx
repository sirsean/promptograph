import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-xl">Promptograph</Link>
          <div className="flex space-x-4">
            <Link 
              to="/create" 
              className={`px-3 py-2 rounded-md ${
                location.pathname === '/create' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Create
            </Link>
            <Link 
              to="/gallery" 
              className={`px-3 py-2 rounded-md ${
                location.pathname === '/gallery' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Gallery
            </Link>
            <Link 
              to="/settings" 
              className={`px-3 py-2 rounded-md ${
                location.pathname === '/settings' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;