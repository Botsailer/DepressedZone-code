import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '../../helper/axios';
import { motion } from 'framer-motion';
import { FiBook, FiCalendar, FiUser, FiTag, FiEye, FiInfo, FiClock, FiArrowLeft, FiHeart } from 'react-icons/fi';

// Enhanced Loading Component
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="relative w-24 h-24">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
      <motion.div 
        className="absolute top-0 left-0 w-full h-full border-4 border-t-purple-600 dark:border-t-purple-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      ></motion.div>
      <div className="absolute inset-0 flex justify-center items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading</span>
      </div>
    </div>
  </div>
);

// Badge component for status and other metadata
const Badge = ({ children, color }) => {
  const colorClasses = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color] || colorClasses.gray}`}>
      {children}
    </span>
  );
};

// Main Manga Info Component
function MangaInfo() {
  const { manga } = useParams();
  const [mangaData, setMangaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate();

  // Helper function to format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing':
        return 'green';
      case 'completed':
        return 'blue';
      case 'hiatus':
        return 'yellow';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://manga-api-vercel.vercel.app/api/manga/${manga}`);
        setMangaData(response.data);
      } catch (error) {
        console.log("Error fetching manga data:", error);
      }
      setLoading(false);
    };
    fetchData();

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [manga]);

  if (loading) return <Loading />;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Header/Hero Section */}
      {mangaData && (
        <div className="relative">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 overflow-hidden" style={{ height: '400px' }}>
            <div 
              className="absolute inset-0 bg-cover bg-center blur opacity-30" 
              style={{ backgroundImage: `url(${mangaData.imageUrl})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-purple-800/40 via-gray-900/70 to-gray-900"></div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 py-8 relative">
            {/* Back button */}
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 text-white bg-gray-900/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full mb-4 hover:bg-gray-900/70 dark:hover:bg-gray-800/70 transition-colors duration-200"
            >
              <FiArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>

            <div className="grid md:grid-cols-3 gap-8 items-start pt-4">
              {/* Manga Cover - Left Side */}
              <div className="col-span-3 md:col-span-1 flex flex-col items-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative rounded-lg overflow-hidden shadow-2xl mb-4"
                >
                  <img 
                    src={mangaData.imageUrl} 
                    alt={mangaData.title} 
                    className="w-full h-auto object-cover"
                  />
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="w-full mt-4 space-y-3"
                >
                  <button 
                    onClick={() => navigate(`/manga/chapters`, {state: mangaData.chapterList})}
                    className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition duration-200 flex items-center justify-center space-x-2 font-medium"
                  >
                    <FiBook className="h-5 w-5" />
                    <span>Read Now</span>
                  </button>
                  
                  <button className="w-full py-3 px-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 flex items-center justify-center space-x-2 font-medium">
                    <FiHeart className="h-5 w-5 text-red-500" />
                    <span>Add to Favorites</span>
                  </button>
                </motion.div>
              </div>

              {/* Manga Details - Right Side */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="col-span-3 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8"
              >
                {/* Title and Status */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">
                    {mangaData.name}
                  </h1>
                  <Badge color={getStatusColor(mangaData.status)}>
                    {mangaData.status}
                  </Badge>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                  <nav className="-mb-px flex space-x-6">
                
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
                        activeTab === 'details'
                          ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Details
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                   
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Metadata - Left column */}
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <FiUser className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Author</div>
                              <div className="text-gray-900 dark:text-white">{mangaData.author || 'Unknown'}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <FiBook className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Chapters</div>
                              <div className="text-gray-900 dark:text-white">
                                {mangaData.chapterList.length > 0 ? mangaData.chapterList.length : 'N/A'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <FiEye className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Views</div>
                              <div className="text-gray-900 dark:text-white">{formatNumber(mangaData.view) || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Metadata - Right column */}
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <FiCalendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</div>
                              <div className="text-gray-900 dark:text-white">{mangaData.updated || 'N/A'}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <FiInfo className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</div>
                              <div className="text-gray-900 dark:text-white">{mangaData.status || 'N/A'}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <FiClock className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Reading Time</div>
                              <div className="text-gray-900 dark:text-white">
                                {mangaData.chapterList.length > 0 ? `~${Math.ceil(mangaData.chapterList.length * 7)} mins` : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Genres */}
                      <div className="flex items-start mt-6">
                        <FiTag className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Genres</div>
                          <div className="flex flex-wrap gap-2">
                            {mangaData.genres.map((genre, index) => (
                              <Link 
                                key={index} 
                                to={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`}
                                className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-800 dark:hover:text-purple-100 transition-colors duration-200"
                              >
                                {genre}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
      
      {!loading && !mangaData && (
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manga Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The manga you're looking for couldn't be located or may have been removed.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition duration-200"
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default MangaInfo;