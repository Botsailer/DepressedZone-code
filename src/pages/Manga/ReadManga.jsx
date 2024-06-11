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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setMangaData({});
        const response = await axios.get(`https://manga-api-vercel.vercel.app/api/manga/${id}`);
        console.log(response.data);
        setMangaData(response.data);
      } catch (error) {
        console.log("error in data:", error);
      }
    };
    window.scrollTo(0, 0);
    fetchData();
  }, [id]);

  const handleNextChapter = () => {
    const currentChapterIndex = mangaData.chapterListIds.findIndex(chapter => chapter.id === mangaData.currentChapter);
    const nextChapterIndex = currentChapterIndex + 1;
    if (nextChapterIndex < mangaData.chapterListIds.length) {
      const nextChapterId = mangaData.chapterListIds[nextChapterIndex].id;
      navigate(`/manga/read?id=${ id.split('/')[0]+'/'+nextChapterId}`);
    }
  };
  const handlePreviousChapter = () => {
    const currentChapterIndex = mangaData.chapterListIds.findIndex(chapter => chapter.id === mangaData.currentChapter);
    const previousChapterIndex = currentChapterIndex - 1;
    if (previousChapterIndex >= 0) {
      const previousChapterId = mangaData.chapterListIds[previousChapterIndex].id;
      navigate(`/manga/read?id=${ id.split('/')[0]+'/'+previousChapterId}`);
    }
  };

  const toggleView = () => {
    setIsVertical(!isVertical);
  };

  if (!mangaData.images || mangaData.images.length === 0) {
    return <Loadingc/>;
  }
  const currentChapterIndex = mangaData.chapterListIds.findIndex(
    chapter => chapter.id === mangaData.currentChapter.replace(" ", "-").toLowerCase()
  );
  console.log(currentChapterIndex)
  const hasNextChapter = currentChapterIndex > 0;
  console.log(hasNextChapter)
  const hasPreviousChapter = currentChapterIndex < mangaData.chapterListIds.length - 1;
  console.log(hasPreviousChapter)
 
  
  return (
    <div className="container mx-auto py-8">

      <div className={`relative ${isVertical ? 'flex flex-col' : 'flex flex-row overflow-x-auto'}`}>
        {mangaData.images.map((chapter, index) => (
          <img
            key={index}
            src={chapter.image}
            alt={`Chapter ${id} - Page ${index + 1}`}
            className={`${isVertical ? 'w-full h-auto mb-4' : 'h-[80vh] w-auto'}`}
          />
        ))}
      </div>
      <div className="flex justify-between mb-4">
       {
       hasPreviousChapter && 
       <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handlePreviousChapter}
          disabled={!hasPreviousChapter}
        >
          Previous Chapter
        </button>}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={toggleView}
        >
          Toggle View
        </button>
       { 
       hasNextChapter && 
       <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleNextChapter}
         
        >
          Next Chapter
        </button>
}</div>
    </div>
  );
}

export default ReadManga;