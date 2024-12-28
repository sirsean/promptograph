
const Footer = () => {
  return (
    <footer className="bg-white shadow-lg mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm">
            Promptograph. Made by <a href="https://sirsean.me">sirsean</a>.
          </div>
          <div className="mt-4 md:mt-0">
            <nav className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
