import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../helper/axios/index';
import Loadingc from '../../Components/Loading';


function Searchquery() {
  const { anime } = useParams();
  const [animeData, setAnimeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (anime) {
      const fetchData = async () => {
        setLoading(true);
        const response = await axios.get(`/meta/anilist/${anime}?fetchFiller=true&dub=true&page=${currentPage}`);
        setAnimeData(response.data.results);;
        setHasNextPage(response.data.hasNextPage);
        setLoading(false);
      };
      fetchData();
    }
  }, [anime, currentPage]);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!anime) {
    return window.location.href = '/';
  }

  if (loading) {
    return <Loadingc />;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mt-8 mb-4">Search Reult for : {anime.replace(/-/g, ' ')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {animeData.map((anime) => (

          anime.status !== "NOT_YET_RELEASED" && (
            <div
              onClick={() => navigate(`/anime/${anime.id}`)} key={anime.id} className="flex flex-col items-center mb-4 border-2 border-gray-300 rounded p-4 hover:shadow-lg transition duration-300 cursor-pointer">

              <img src={anime.image} alt={anime.title.userPreferred} className="w-40 h-52 rounded mb-2" />
              <div className="mt-2 text-center">
                <h3 className="font-bold">{anime.title.userPreferred}</h3>
                <p>
                  <span className="font-bold">Type :{anime.type}</span>
                </p>
                <p>
                  <span className="font-bold"> {anime.releaseDate} </span>
                </p>
                <div className="flex flex-wrap justify-center mt-2">


                  {anime.nsfw ? <span className=' font-bold p-1 text-white bg-orange-900'>18+</span> : <></>}
                  {anime.type === "OVA" ? <span className=' ml-2 font-bold p-1 text-white bg-emerald-900'>OVA</span> : null}



                </div>
                <p className="text-sm text-gray-700">{anime.score}</p>
              </div>
            </div>)
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {
          currentPage > 1 && (
            <button
              onClick={previousPage}
              className={`px-4 py-2 text-black font-bold rounded mr-2 ${currentPage === 1 ? 'bg-gray-200' : 'bg-gray-300 hover:bg-gray-400'}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          )
        }

        <span className="px-4 py-2  text-black font-bold bg-gray-300 rounded mr-2">Page {currentPage} </span>
        {hasNextPage && (
          <button onClick={() => {
            event.target.disabled = true;
            nextPage();


          }} className="px-4 py-2 text-black font-bold bg-gray-300 rounded hover:bg-gray-400">
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Searchquery;
