import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '../../helper/axios';
import { motion } from 'framer-motion';
import { FiSearch, FiChevronLeft, FiChevronRight, FiHome, FiBookOpen } from 'react-icons/fi';

// Enhanced Loading component is used from your existing components

function SearchManga() {
  const { manga } = useParams();
  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const navigate = useNavigate();

  // Format search query for display
  const formatSearchQuery = (query) => {
    return decodeURIComponent(query)
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    if (!manga) {
      return window.location.href = '/manga';
    }

    const fetchData = async() => {
      setLoading(true);
      window.scrollTo(0, 0);
      
      try {
        const response = await axios.get(`https://manga-api-vercel.vercel.app/api/search/${manga}?page=${currentPage}`);
        setMangaList(response.data.mangaList);
        setTotalPages(response.data.metaData.totalPages);
        setTotalResults(response.data.metaData.totalStories || 0);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [manga, currentPage]);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <FiHome className="w-5 h-5" />
                </Link>
                <span className="text-gray-500 dark:text-gray-400">/</span>
                <Link to="/manga" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <FiBookOpen className="w-5 h-5" />
                </Link>
                <span className="text-gray-500 dark:text-gray-400">/</span>
                <span className="text-gray-700 dark:text-gray-300">Search</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-2 flex items-center">
                <FiSearch className="mr-2 h-6 w-6 text-purple-600 dark:text-purple-400" />
                <span>Results for</span>
                <span className="ml-2 text-purple-700 dark:text-purple-400">"{formatSearchQuery(manga)}"</span>
              </h1>
            </div>
            
            <div className="flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full text-sm font-medium">
                {totalResults} Titles Found
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
              <motion.div 
                className="absolute top-0 left-0 w-full h-full border-4 border-t-purple-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              ></motion.div>
            </div>
          </div>
        ) : (
          <>
            {mangaList.length > 0 ? (
              <motion.section 
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {mangaList.map((mangaItem, index) => (
                  <motion.div
                    key={mangaItem.id || index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/mangainfo/${mangaItem.id}`)}
                    className="flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
                  >
                    <div className="relative pb-[140%] overflow-hidden">
                      <img
                        src={mangaItem.image}
                        alt={mangaItem.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">{mangaItem.title}</h2>
                      
                      {/* Add badges or additional info here if available */}
                      {mangaItem.type && (
                        <div className="mt-auto pt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            {mangaItem.type}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.section>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <FiSearch className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No results found</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  We couldn't find any manga matching "{formatSearchQuery(manga)}". Try a different search term.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 0 && (
              <div className="mt-10 mb-6 flex justify-center">
                <nav className="flex items-center bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-md space-x-2">
                  <button
                    onClick={previousPage}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FiChevronLeft className="mr-1" />
                    Previous
                  </button>
                  
                  <div className="px-4 py-2 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-medium text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= totalPages}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage >= totalPages
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Next
                    <FiChevronRight className="ml-1" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchManga;