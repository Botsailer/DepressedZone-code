import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiBook, FiEye, FiCalendar, FiList, FiChevronsUp, FiChevronsDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function RenderChapters() {
  const location = useLocation();
  const navigate = useNavigate();
  const chapters = location.state;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [chaptersPerPage] = useState(20);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = newest first, 'asc' = oldest first
  const [isLoading, setIsLoading] = useState(true);

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format view count with commas for thousands
  const formatViewCount = (count) => {
    if (!count && count !== 0) return 'N/A';
    return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Extract chapter number from name if possible
  const extractChapterNumber = (name) => {
    if (!name) return null;
    
    const match = name.match(/Chapter\s+(\d+(\.\d+)?)/i) || 
                 name.match(/Ch\.\s*(\d+(\.\d+)?)/i) ||
                 name.match(/(\d+(\.\d+)?)/);
                 
    return match ? parseFloat(match[1]) : null;
  };

  useEffect(() => {
    // Simulate loading to allow animation to show
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!chapters) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center p-4">
        <div className="text-center max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <FiBook className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Chapters Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">It seems you may have skipped a step or the manga doesn't have any available chapters yet.</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center mx-auto"
          >
            <FiArrowLeft className="mr-2" /> Return to Manga Details
          </button>
        </div>
      </div>
    );
  }

  // Sort chapters
  const sortedChapters = [...chapters].sort((a, b) => {
    const aNum = extractChapterNumber(a.name);
    const bNum = extractChapterNumber(b.name);
    
    // If both have valid numbers, compare them
    if (aNum !== null && bNum !== null) {
      return sortOrder === 'desc' ? bNum - aNum : aNum - bNum;
    }
    
    // Fall back to comparing names
    return sortOrder === 'desc' 
      ? b.name.localeCompare(a.name) 
      : a.name.localeCompare(b.name);
  });

  // Calculate pagination
  const indexOfLastChapter = currentPage * chaptersPerPage;
  const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
  const currentChapters = sortedChapters.slice(indexOfFirstChapter, indexOfLastChapter);
  const totalPages = Math.ceil(chapters.length / chaptersPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
  }

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <button 
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-2"
              >
                <FiArrowLeft className="mr-2" />
                <span>Back</span>
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Chapters <span className="text-gray-500 dark:text-gray-400 text-lg font-normal">({chapters.length})</span>
              </h1>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FiList />
                <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
                {sortOrder === 'desc' ? <FiChevronsDown /> : <FiChevronsUp />}
              </button>
            </div>
          </div>
        </div>

        {/* Chapters Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
              <motion.div 
                className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              ></motion.div>
              <div className="absolute inset-0 flex justify-center items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading</span>
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentChapters.map((chapter) => (
              <motion.div
                key={chapter.id || chapter.path}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div 
                  className="p-6 cursor-pointer h-full flex flex-col"
                  onClick={() => navigate(`/manga/read?id=${chapter.path.replace("/chapter/", "")}`)}
                >
                  <div className="flex-grow">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {chapter.name}
                    </h2>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <FiCalendar className="mr-2 h-4 w-4" />
                      <span>{formatDate(chapter.createdAt)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiEye className="mr-2 h-4 w-4" />
                      <span>{formatViewCount(chapter.view)} views</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && chapters.length > chaptersPerPage && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-md">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-2 rounded-md mr-2 ${
                  currentPage === 1
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="hidden sm:flex">
                {pageNumbers.map((number, index) => (
                  <button
                    key={index}
                    onClick={() => typeof number === 'number' ? paginate(number) : null}
                    disabled={number === '...'}
                    className={`px-4 py-2 mx-1 rounded-md ${
                      number === currentPage
                        ? 'bg-indigo-600 text-white'
                        : number === '...'
                        ? 'text-gray-500 dark:text-gray-400 cursor-default'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              
              <div className="sm:hidden px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-2 rounded-md ml-2 ${
                  currentPage === totalPages
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default RenderChapters;