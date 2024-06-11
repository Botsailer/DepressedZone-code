import { useEffect, useState } from 'react';
import { Link, redirect, useNavigate} from 'react-router-dom';
import axios from '../../helper/axios/index';
import Loadingc from '../../Components/Loading';

function Homepage() {
  const [topPopularAnime, setTopPopularAnime] = useState([]);
  const [recentEpisodes, setRecentEpisodes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [neverShow, setNeverShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [Loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  const handleClosePopup = () => {
    setShowPopup(false);
    if (neverShow) {
      localStorage.setItem('neverShowPopup', 'true');
    }
  };


  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
  

    const fetchPopularAnime = async () => {
      setLoading(true);
      const response = await axios.get(`/anime/gogoanime/popular?perPage=${20}&page=${page}`);
      console.log(response.data.results);
      setTopPopularAnime(response.data.results);
      setLoading(false);
    };
  
 
    const fetchRecentEpisodes = async () => {
      const response = await axios.get('/anime/gogoanime/recent-episodes');
      console.log(response.data.results);
      setRecentEpisodes(response.data.results);
    };
  

    const fetchGenres = async () => {
      const response = await axios.get('/anime/gogoanime/genre/list');
      console.log(response.data);
      setGenres(response.data);
    };

    Promise.all([fetchPopularAnime(), fetchRecentEpisodes(), fetchGenres()]).then(() => {
      setLoading(false);
        setShowPopup(true);
    }).catch((error) => {
      console.log(error);
    })
  }, [page]); 


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    
  };

  return (
    <div className="container mx-auto">
      {
        Loading? <Loadingc /> : <>{showPopup && (
      <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 text-center " id="modal-title">
                    Attention
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-black">
                      Your request Might be slow due to the server being hosted on a fucking Teensy 4.1 with Fucking 32 MB Ram. Please be patient.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleClosePopup}>
                OK
              </button>
              <div className="mt-2 sm:mt-0 sm:w-auto sm:text-sm flex items-center">
                <input id="never-show" name="never-show" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={neverShow} onChange={() => setNeverShow(!neverShow)} />
                <label htmlFor="never-show" className="ml-2 block text-sm text-gray-900">
                  Never show again
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
    }</>}

 
 <form
  onSubmit={(event) => {
    event.preventDefault();
    navigate(`/search/${searchTerm.replace(/ /g, '-').toLowerCase()}`);
  }}
  className="flex flex-col md:flex-row items-center justify-between py-4 px-2 md:px-0 bg-gray-900 text-white"
>
  <h1 className="text-4xl text-center md:text-left mb-4 md:mb-0 w-full font-bold">
    Depressed Zone
  </h1>
  <input
    type="text"
    placeholder="Search anime..."
    value={searchTerm}
    onChange={handleSearch}
    className="px-2 py-1 rounded border border-gray-300 w-full md:w-auto bg-white text-gray-900"
  />
  <input
    type="submit"
    value="Search"
    className="mt-2 md:mt-0 md:ml-2 px-2 py-1 rounded bg-white text-gray-900 cursor-pointer"
  />
</form>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 mt-8">Top Popular Anime</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topPopularAnime.map((anime) => (
            <div
              onClick={() => navigate(`/search/${anime.title.replace(/ /g, '-').toLowerCase()}`)}
              key={anime.id}
              className="flex flex-col items-center mb-4 border-2 border-gray-300 rounded p-4 hover:shadow-lg transition duration-300 cursor-pointer"
            >
              <img src={anime.image} alt={anime.title} className="w-40 h-52 rounded mb-2" />
              <div className="mt-2 text-center">
                <h3 className="font-bold">{anime.title}</h3>
                <p className="text-sm">Released Year {anime.releaseDate}</p>
                {/* <div className="flex flex-wrap justify-center mt-2">
                  {anime.genres.map((genre, index) => (
                    <span key={index} className="m-1 p-1 bg-blue-500 text-white text-xs rounded">{genre}</span>
                  ))}
                </div> */}
              </div>
            </div>
          ))}
        </div>
        <div className="pagination flex justify-center mt-8">
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            className="px-4 py-2 bg-gray-300  text-black font-bold rounded mr-2 hover:bg-gray-400"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-300 text-black font-bold rounded mr-2">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-300 text-black font-bold rounded hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Episodes </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentEpisodes.map((anime) => (
            <div onClick={
              () => navigate(`/episodes`, { state: {preplayer: anime.episodeId} })
            } key={anime.id} className="flex flex-col items-center mb-4 border-2 border-gray-300 rounded p-4 hover:shadow-lg transition duration-300">
              <img src={anime.image} alt={anime.title} className="w-40 h-52 rounded mb-2" />
              <div className="mt-2 text-center">
                <h3 className="font-bold">{anime.title}</h3>
              </div>
              <p>
                <span className="font-bold">Episode:</span> {anime.episodeNumber}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Genres</h2>
        <div className="flex flex-wrap justify-center">
          {genres.map((genre) => (
            <button
            onClick={() => navigate(`/anime/genres/${genre.id}`)}
              key={genre.id}
              className="px-4 py-2 rounded bg-blue-500 text-white mr-2 mb-2 hover:bg-blue-600 transition duration-300"
            >
              {genre.title}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Homepage;