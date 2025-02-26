import React, { useEffect, useState } from 'react';
import axios from '../../helper/axios';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Loadingc from '../../Components/Loading';

function ReadManga() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const location = useLocation();
  const navigate = useNavigate();

  const [mangaData, setMangaData] = useState({});
  const [isVertical, setIsVertical] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setMangaData({});
        const response = await axios.get(`https://manga-api-vercel.vercel.app/api/manga/${id}`);

        const data = response.data;
        data.chapterListIds = data.chapterListIds.reverse();
        data.currentChapter = id;
        setMangaData(data);
      } catch (error) {
        console.log("Error fetching manga data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    window.scrollTo(0, 0);
    fetchData();
  }, [id]);

  const toggleView = () => {
    setIsVertical(!isVertical);
  };
  
  const handleNextChapter = () => {
    const currentChapterId = id.split('/').pop();
    const currentChapterIndex = mangaData.chapterListIds.findIndex(chapter => chapter.id.endsWith(currentChapterId));
    
    if (currentChapterIndex !== -1 && currentChapterIndex < mangaData.chapterListIds.length - 1) {
      const nextChapterId = mangaData.chapterListIds[currentChapterIndex + 1].id;
      navigate(`/manga/read?id=${nextChapterId}`);
    }
  };
  
  const handlePreviousChapter = () => {
    const currentChapterId = id.split('/').pop();
    const currentChapterIndex = mangaData.chapterListIds.findIndex(chapter => chapter.id.endsWith(currentChapterId));
    
    if (currentChapterIndex > 0) {
      const previousChapterId = mangaData.chapterListIds[currentChapterIndex - 1].id;
      navigate(`/manga/read?id=${previousChapterId}`);
    }
  };

  if (loading || !mangaData.images || mangaData.images.length === 0) {
    return <Loadingc />;
  }
  
  // Determine if next/previous chapters are available
  const currentChapterId = id.split('/').pop();
  const currentChapterIndex = mangaData.chapterListIds.findIndex(chapter => chapter.id.endsWith(currentChapterId));
  const hasNextChapter = currentChapterIndex !== -1 && currentChapterIndex < mangaData.chapterListIds.length - 1;
  const hasPreviousChapter = currentChapterIndex > 0;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header with manga title and controls */}
      <div className="sticky top-0 z-10 bg-gray-800 shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {hasPreviousChapter && (
              <button
                onClick={handlePreviousChapter}
                className="mr-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-all duration-200"
                aria-label="Previous Chapter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-xl font-bold truncate max-w-xs md:max-w-sm">
              {mangaData.title || "Reading Manga"}
            </h1>
          </div>
          
          <div className="flex items-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 md:px-6 rounded-full transition-all duration-200 flex items-center mr-3"
              onClick={toggleView}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isVertical ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
              <span className="hidden md:inline">{isVertical ? "Horizontal View" : "Vertical View"}</span>
            </button>
            
            {hasNextChapter && (
              <button
                onClick={handleNextChapter}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-all duration-200"
                aria-label="Next Chapter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Chapter info bar */}
        <div className="container mx-auto mt-2 flex justify-between text-gray-400 text-sm">
          <span>
            {currentChapterIndex !== -1 && mangaData.chapterListIds[currentChapterIndex].name}
          </span>
          <span>
            {currentChapterIndex + 1} / {mangaData.chapterListIds.length}
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="container mx-auto px-4 py-6">
        {/* Image display section */}
        <div className={`
          ${isVertical 
            ? 'flex flex-col space-y-4' 
            : 'flex flex-row space-x-4 overflow-x-auto pb-4'
          }
          transition-all duration-300 ease-in-out
        `}>
          {mangaData.images.map((chapter, index) => (
            <div 
              key={index} 
              className={`
                ${isVertical ? 'w-full' : 'flex-none'} 
                bg-gray-800 rounded-lg overflow-hidden shadow-xl
              `}
            >
              <img
                src={chapter.image}
                alt={`Chapter ${id.split('/').pop()} - Page ${index + 1}`}
                className={`
                  ${isVertical 
                    ? 'w-full h-auto' 
                    : 'h-[85vh] w-auto'
                  }
                  object-contain mx-auto
                `}
                loading="lazy"
              />
              <div className="p-2 text-center text-gray-400 text-sm">
                Page {index + 1} of {mangaData.images.length}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer controls */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        {/* Toggle view button */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200"
          onClick={toggleView}
          aria-label="Toggle View"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isVertical ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {hasNextChapter && (
          <button
            onClick={handleNextChapter}
            className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-full shadow-lg transition-all duration-200"
            aria-label="Next Chapter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
        
        {hasPreviousChapter && (
          <button
            onClick={handlePreviousChapter}
            className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-full shadow-lg transition-all duration-200"
            aria-label="Previous Chapter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default ReadManga;