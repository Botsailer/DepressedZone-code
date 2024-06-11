import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RenderChapters() {
  const location = useLocation();
  const chapters = location.state;
  const [currentPage, setCurrentPage] = useState(1);
  const [chaptersPerPage] = useState(100);

  const navigate = useNavigate();
  if (!chapters) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">No Chapters Found. Maybe you skipped a step?</h1>
      </div>
    );
  }

  const indexOfLastChapter = currentPage * chaptersPerPage;
  const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
  const currentChapters = chapters.slice(indexOfFirstChapter, indexOfLastChapter);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Chapters</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentChapters.map((chapter,index) => {
            
            return(     
                
            <div
            key={chapter.id}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
            onClick={() => 
                navigate(`/manga/read?id=${chapter.path.replace("/chapter/", "")}`)
                }>
            <h2 className="text-xl text-black
             font-bold mb-2">{chapter.name}</h2>
            <p className="text-gray-600">Chapter {chapter.name}</p>
            <br />
            <p className="text-gray-600">Creation: {chapter.createdAt}</p>
            <br />
            <p className="text-gray-600">view: {chapter.view}</p>
          </div>
         )}
        )}
      </div>
      <div className="flex justify-center mt-8">
        <button
          className={`px-4 py-2 rounded-l ${
            currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className={`px-4 py-2 rounded-r ${
            indexOfLastChapter >= chapters.length ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastChapter >= chapters.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default RenderChapters;