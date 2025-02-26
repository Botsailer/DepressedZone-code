import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../helper/axios/index';
import Loadingc from '../../Components/Loading';
import EpisodeCarousel from '../../Components/EpisodeCarousel';
import GenreList from '../../Components/GenreList';

function Homepage() {
  const [topPopularAnime, setTopPopularAnime] = useState([]);
  const [recentEpisodes, setRecentEpisodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [Loading, setLoading] = useState(false);
 

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    const fetchPopularAnime = async () => {
      const response = await axios.get(`/meta/anilist/popular?provider=zoro&perPage=28&page=${page}`);
      // console.log(response.data.results);
      setTopPopularAnime(response.data.results);
    };

    const fetchRecentEpisodes = async () => {
      const response = await axios.get('/anime/zoro/recent-episodes?&perPage=25');
   //   console.log(response.data.results);
      setRecentEpisodes(response.data.results);
    };

    Promise.all([fetchPopularAnime(), fetchRecentEpisodes()])
      .then(() => setLoading(false))
      .catch((error) => console.log(error));
  }, [page]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };





  return (
    <div className="container mx-auto px-4">
      {Loading ? (
        <Loadingc />
      ) : (
        <>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              navigate(`/search/${searchTerm.replace(/ /g, '-').toLowerCase()}`);
            }}
            className="py-4 text-white"
          >
            <div className="flex items-center md:justify-end">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchTerm}
                required
                onChange={handleSearch}
                className="px-2 py-1 rounded border placeholder-white border-gray-300 w-full md:w-auto bg-gray-500 text-white"
              />
              <input
                type="submit"
                value="Search"
                className="mt-2 md:mt-0 md:ml-2 px-2 py-1 rounded bg-amber-600 text-gray-900 cursor-pointer"
              />
            </div>
          </form>

          <div className="mt-8 w-full flex-row">
            <h2 className="text-2xl font-bold mb-4">Recent Episodes</h2>
            <div className="flex flex-col md:flex-row w-full">
              <EpisodeCarousel episodes={recentEpisodes} />
              <GenreList />
            </div>
          </div>

          <div className="flex flex-col md:flex-row mt-8">
            <section className="w-full md:w-3/4">
              <h2 className="text-2xl font-bold inline  mb-4">Top Popular Anime</h2>  <div className='ml-8 inline-block'>
                {/* <div className="flex  items-center">
                  <span className="mr-3 text-xl font-extrabold ">{Dub ? "Dub only" : "Sub Only"}</span>
                  <label htmlFor="autoplay-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="autoplay-toggle"
                        className="sr-only"
                        checked={Dub}
                        onChange={handleDub}
                      />
                      <div className="w-10 h-6 bg-gray-400 rounded-full shadow-inner"></div>
                      <div
                        className={`absolute w-5 h-5 bg-white rounded-full shadow inset-y-0.5 left-0 transform transition ${Dub ? 'translate-x-5 bg-green-500' : 'translate-x-0'
                          }`}
                      ></div>
                    </div>
                  </label>
                </div> */}
              </div>
              <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {topPopularAnime.map((anime) => (
                  <div
                    onClick={() => navigate(`/anime/${anime.id}?fetchFiller=true`)}
                    key={anime.id}
                    className="flex flex-col items-center mb-4 border-2 border-gray-300 rounded p-4 hover:shadow-lg transition duration-300 cursor-pointer"
                  >
                    <img src={anime.image} alt={anime.title.english} className="w-40 h-52 rounded mb-2" />
                    <div className="mt-2 text-center">
                      <h3 className="font-bold">{anime.title.english}</h3>
                      <p className="text-sm">Released Year {anime.releaseDate}</p>
                      <p className="text-sm">Episodes {anime.totalEpisodes}</p>
                      <p className="text-sm">status {anime.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  className="px-4 py-2 bg-gray-300 text-black font-bold rounded mr-2 hover:bg-gray-400"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-gray-300 text-black font-bold rounded mr-2">
                  Page {page}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-gray-300 text-black font-bold rounded hover:bg-gray-400"
                >
                  Next
                </button>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default Homepage;