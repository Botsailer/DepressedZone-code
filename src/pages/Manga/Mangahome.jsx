import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import { useQuery } from 'react-query';
import { FiSearch, FiMoon, FiSun, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import GenreGrid from './genersGrid'; 

const Loading = () => (
  <div className="flex justify-center items-center h-64">
    <div className="relative w-24 h-24">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-300 rounded-full"></div>
      <motion.div 
        className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      ></motion.div>
      <p className="absolute inset-0 flex justify-center items-center text-sm font-medium">Loading</p>
    </div>
  </div>
);

const useDarkMode = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  return [theme, setTheme];
};

// Suggestion component for real-time search
const SearchSuggestions = ({ suggestions, searchTerm, onSelectSuggestion, onClose }) => {
  if (!suggestions.length || !searchTerm) return null;
  
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} className="bg-yellow-200 dark:bg-yellow-700">{part}</span> : part
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto"
    >
      <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium">Suggestions</h3>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FiX />
        </button>
      </div>
      <ul>
        {suggestions.map((suggestion) => (
          <motion.li 
            key={suggestion.id}
            whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
            className="p-2 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            <div className="flex items-center space-x-2">
              <img 
                src={suggestion.image} 
                alt={suggestion.title} 
                className="w-10 h-14 object-cover rounded"
              />
              <div className="text-sm">{highlightMatch(suggestion.title, searchTerm)}</div>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

// Main component
function MangaPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [theme, setTheme] = useDarkMode();
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  
  // Used for global styles
  const globalStyles = `
    * {
      cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="none" stroke="%236366F1" stroke-width="1.5"/></svg>'), auto;
    }
    
    a, button, [role="button"], input, select, textarea, .cursor-pointer {
      cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%236366F1" fill-opacity="0.2" stroke="%236366F1" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="%236366F1"/></svg>'), pointer;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(99, 102, 241, 0.5);
      border-radius: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: rgba(99, 102, 241, 0.7);
    }
  `;

  // Fetch manga list - now using pageNumber state instead of page
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery(
    ['mangaList', pageNumber],
    async () => {
      const url = `https://manga-api-vercel.vercel.app/api/mangalist?page=${pageNumber}`;
      const response = await axios.get(url);
      return response.data;
    },
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      onError: (err) => {
        console.error('Error fetching manga list:', err);
      }
    }
  );

  // Fetch genres - now also using pageNumber state
  const {
    data: genreData,
    isLoading: isGenreLoading,
  } = useQuery(
    ['genres', pageNumber],
    async () => {
      const defaultGenres = [
        { id: 'romance', name: 'Romance' },
        { id: 'action', name: 'Action' },
        { id: 'comedy', name: 'Comedy' },
        { id: 'drama', name: 'Drama' },
        { id: 'yuri', name: 'Yuri' },
        { id: 'fantasy', name: 'Fantasy' },
        { id: 'shoujo', name: 'Shoujo' },
        { id: 'seinen', name: 'Seinen' },
        { id: 'shounen', name: 'Shounen' },
        { id: 'slice-of-life', name: 'Slice of Life' },
        { id: 'bloody', name: 'Bloody' },
        { id: 'demons', name: 'Demons' },
        { id: 'system', name: 'System' },
        { id: 'loli', name: 'Loli' },
        { id: 'ninja', name: 'Ninja' },
        { id: 'incest', name: 'Incest' },
        { id: 'crime', name: 'Crime' },
        { id: 'office-workers', name: 'Office Workers' },
        { id: 'sexual-violence', name: 'Sexual Violence' },
        { id: 'crossdressing', name: 'Crossdressing' },
        { id: 'gore', name: 'Gore' },
        { id: 'delinquents', name: 'Delinquents' },
        { id: 'shota', name: 'Shota' },
        { id: 'police', name: 'Police' },
        { id: 'manga', name: 'Manga' },
        { id: 'time-travel', name: 'Time Travel' },
        { id: 'monster-girls', name: 'Monster Girls' },
        { id: 'anthology', name: 'Anthology' },
        { id: '4-koma', name: '4-Koma' },
        { id: 'oneshot', name: 'Oneshot' },
        { id: 'animals', name: 'Animals' },
        { id: 'heartwarming', name: 'Heartwarming' },
        { id: 'superhero', name: 'Superhero' },
        { id: 'magic', name: 'Magic' },
        { id: 'genderswap', name: 'Genderswap' },
        { id: 'post-apocalyptic', name: 'Post-Apocalyptic' },
        { id: 'music', name: 'Music' },
        { id: 'sci-fi', name: 'Sci-Fi' },
        { id: 'self-published', name: 'Self-Published' },
        { id: 'aliens', name: 'Aliens' },
        { id: 'villainess', name: 'Villainess' },
        { id: 'virtual-reality', name: 'Virtual Reality' },
        { id: 'ghosts', name: 'Ghosts' },
        { id: 'award-winning', name: 'Award Winning' },
        { id: 'video-games', name: 'Video Games' },
        { id: 'magical-girls', name: 'Magical Girls' },
        { id: 'reverse-harem', name: 'Reverse Harem' },
        { id: 'fan-colored', name: 'Fan Colored' },
        { id: 'zombies', name: 'Zombies' },
        { id: 'mafia', name: 'Mafia' },
        { id: 'webtoon', name: 'Webtoon' },
        { id: 'royal-family', name: 'Royal Family' },
        { id: 'manhwa-hot', name: 'Manhwa Hot' },
        { id: 'traditional-games', name: 'Traditional Games' },
        { id: 'magical', name: 'Magical' },
        { id: 'vampires', name: 'Vampires' },
        { id: 'revenge', name: 'Revenge' },
        { id: 'ecchi', name: 'Ecchi' },
        { id: 'samurai', name: 'Samurai' },
        { id: 'yaoi', name: 'Yaoi(BL)' },
        { id: 'monster', name: 'Monster' },
        { id: 'super-power', name: 'Super Power' },
        { id: 'animal', name: 'Animal' },
        { id: 'game', name: 'Game' }
      ];

      try {
        const response = await axios.get(`https://manga-api-vercel.vercel.app/api/mangalist?page=${pageNumber}`);
        return response.data.metaData?.category || defaultGenres;
      } catch (error) {
        console.error('Error fetching genres:', error);
        return defaultGenres;
      }
    },
    {
      staleTime: Infinity,
    }
  );

  
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearch.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(
          `https://manga-api-vercel.vercel.app/api/search/${debouncedSearch.replace(/ /g, '-').toLowerCase()}`
        );
        
        if (response.data && Array.isArray(response.data.mangaList)) {
          setSuggestions(response.data.mangaList.slice(0, 5));
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    setShowSuggestions(false);
    navigate(`/mangainfo/${suggestion.id}`);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/searchmanga/${searchTerm.replace(/ /g, '-').toLowerCase()}`);
      setShowSuggestions(false);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Handle page change with updated pageNumber state
  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render manga cards
  const renderMangaCards = () => {
    if (!data || !data.mangaList) return null;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {data.mangaList.map((manga) => (
          <motion.div
            key={manga.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate(`/mangainfo/${manga.id}`)}
            className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="relative pb-[140%] overflow-hidden">
              <img
                src={manga.image}
                alt={manga.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-3 space-y-2">
              <h2 className="font-medium text-gray-900 dark:text-white line-clamp-2 min-h-[2.5rem]">{manga.title}</h2>
              {manga.chapter && (
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Chapter:</span> {manga.chapter}
                </p>
              )}
              {manga.view && (
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Views:</span> {manga.view}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Render pagination controls - updated to use pageNumber
  const renderPagination = () => {
    if (!data || !data.metaData || !data.metaData.totalPages) return null;

    const totalPages = parseInt(data.metaData.totalPages);
    
    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
          <span className="text-gray-700 dark:text-gray-300">
            {pageNumber} / {totalPages}
          </span>
        </div>
        
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber >= totalPages}
          className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Custom cursor styles */}
      <style>{globalStyles}</style>

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search bar and theme toggle moved to top of main content */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full">
            <div className="relative flex-grow" ref={searchInputRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for manga..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors text-gray-900 dark:text-white"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
                <AnimatePresence>
                  {showSuggestions && (
                    <SearchSuggestions
                      suggestions={suggestions}
                      searchTerm={searchTerm}
                      onSelectSuggestion={handleSelectSuggestion}
                      onClose={() => setShowSuggestions(false)}
                    />
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>

        {/* Browse by Genre Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Browse by Genre
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {genreData ? `${genreData.length} genres available` : ''}
            </span>
          </div>
          
          {isGenreLoading ? (
            <div className="h-40 flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            <GenreGrid genres={genreData || []} />
          )}
        </section>
        
        {/* Latest Manga Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Latest Updates
          </h2>

          {/* Error state */}
          {isError && (
            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md mb-6">
              <p>Error loading manga list: {error?.message || 'Unknown error occurred'}</p>
              <button
                onClick={() => refetch()}
                className="mt-2 px-4 py-2 bg-red-200 dark:bg-red-800 rounded-md hover:bg-red-300 dark:hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading state */}
          {isLoading ? <Loading /> : (
            <>
              {/* Manga grid */}
              {renderMangaCards()}
              
              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-8 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Botsailer aka Hrs God
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MangaPage;