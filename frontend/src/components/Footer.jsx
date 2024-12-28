
const Footer = () => {
  return (
    <footer className="bg-cyberpunk shadow-lg mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-cyberpunk-600 text-sm">
            Promptograph. Made by <a href="https://sirsean.me">sirsean</a>.
          </div>
          <div className="mt-4 md:mt-0">
            <nav className="flex space-x-4">
              <a href="https://github.com/sirsean/promptograph" className="text-cyberpunk-600 hover:text-cyberpunk-900 text-sm">
                Github
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
