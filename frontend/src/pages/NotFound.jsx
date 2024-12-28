const NotFound = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-8">The page you're looking for doesn't exist.</p>
      <Link 
        to="/" 
        className="text-blue-500 hover:underline"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;