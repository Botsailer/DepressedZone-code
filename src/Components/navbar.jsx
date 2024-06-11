import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ darkMode, setDarkMode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const html = document.querySelector('html');
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white sticky top-0 z-50">
      <div className="flex items-center">
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L20.586 9H4a1 1 0 110-2h16.586l-1.293-1.293a1 1 0 010-1.414z"
              />
            ) : (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 6a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm0 5a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm1 4a1 1 0 100 2h14a1 1 0 100-2H5z"
              />
            )}
          </svg>
        </button>
        <Link to="/" className="text-2xl font-bold ml-4 md:text-3xl">
          Depressed Zone
        </Link>
      </div>
      <div
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:flex md:items-center`}
      >
        <div className="flex flex-col md:flex-row md:ml-6">
          <Link
            to="/"
            className={`mt-2 md:mt-0 md:ml-6 text-white hover:text-gray-200 ${
              isActive('/') ? 'bg-green-500' : ''
            } px-3 py-1 rounded`}
          >
            Anime
          </Link>
          <Link
            to="/manga"
            className={`mt-2 md:mt-0 md:ml-6 text-white hover:text-gray-200 ${
              isActive('/manga') ? 'bg-green-500' : ''
            } px-3 py-1 rounded`}
          >
            Manga
          </Link>

          <Link
            to="/movie"
            className={`mt-2 md:mt-0 md:ml-6 text-white hover:text-gray-200 ${
              isActive('/movie') ? 'bg-green-500' : ''
            } px-3 py-1 rounded`}
          >
            Movie Info
          </Link>
          

        </div>
      </div>
      <div className="md:ml-4 flex items-center">
        <span className="mr-2">{darkMode ? 'Light' : 'Dark'} Mode</span>
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-12 h-6 rounded-full bg-white focus:outline-none"
        >
          <div
            className={`w-6 h-6 rounded-full shadow-md transform transition-transform ${
              darkMode ? 'bg-gray-800 translate-x-6' : 'bg-purple-600 -translate-x-3'
            }`}
          ></div>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;