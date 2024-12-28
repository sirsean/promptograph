import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-cyberpunk shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src="/android-chrome-192x192.png" alt="Promptograph" className="h-12 w-12 rounded-sm" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;