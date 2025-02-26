import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../helper/axios';
const GenreList = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGenreList, setShowGenreList] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('/anime/gogoanime/genre/list');
        setGenres(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const displayedGenres = showAll ? genres : genres.slice(0, 20);

  if (loading) {
    return <div>Loading genres...</div>;
  }

  return (
    <aside className="mt-8 md:mt-0 md:ml-8 w-full md:w-1/4">

<div className="md:hidden">
        <button
          onClick={() => setShowGenreList(!showGenreList)}
          className="px-4 py-2 bg-gray-300 text-black font-bold rounded hover:bg-gray-400"
        >
          {showGenreList ? 'Hide Genres' : 'Show Genres'}
        </button>
      </div>
       {(showGenreList || window.innerWidth >= 768) && (
        <div className=" border-violet-800  border-2">
          <h2 className="text-2xl  justify-center items-center w-full border-violet-800 border-b-2 flex font-bold mb-4">Genres</h2>
          <div className="flex h-60 flex-wrap overflow-x-hidden overflow-y-scroll">
            {displayedGenres.map((genre) => (
              <span
                key={genre.id}
                onClick={() => navigate(`/anime/genres/${genre.id}`)}
                className={`cursor-pointer overflow-hidden  font-bold w-[100px] h-[20px] m-2 md:w-[80px] hover:underline`}
              >
                {genre.title}
              </span>
            ))}
          </div>
          {!showAll && genres.length > 20 && (
            <button onClick={() => setShowAll(true)} className="mt-4 text-blue-500 hover:underline">
              Show more
            </button>
          )}
        </div>
      )}
    </aside>
  );
};

export default GenreList;