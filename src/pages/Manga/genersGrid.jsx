import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

const GenreGrid = ({ genres }) => {
  const [genreSearch, setGenreSearch] = useState('');
  
  // Filter genres based on search input
  const filteredGenres = useMemo(() => {
    if (!genreSearch.trim()) return genres;
    return genres.filter(genre => 
      genre.name.toLowerCase().includes(genreSearch.toLowerCase())
    );
  }, [genres, genreSearch]);

  return (
    <div className="space-y-4">
      {/* Genre search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Find a genre..."
          value={genreSearch}
          onChange={(e) => setGenreSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors text-gray-900 dark:text-white"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      
      {/* Scrollable genre container */}
      <div className="max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredGenres.map((genre) => (
            <Link
              key={genre.id}
              to={`/genre/${genre.name.replace(/ /g, '-').toLowerCase()}`}
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 p-3 rounded-lg text-white text-center font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                {genre.name}
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Message when no genres match search */}
      {filteredGenres.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No genres found matching "{genreSearch}"
        </div>
      )}
    </div>
  );
};

export default GenreGrid;