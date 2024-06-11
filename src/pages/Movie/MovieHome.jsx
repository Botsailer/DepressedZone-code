import React, { useEffect, useState } from 'react';
import axios from '../../helper/axios';
import Loadingc from '../../Components/Loading';
import { useNavigate } from 'react-router-dom';

function MovieHome() {
  const [recentMovies, setRecentMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [recentShows, setRecentShows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');  
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const recentMoviesResponse = await axios.get('/movies/flixhq/recent-movies');
        setRecentMovies(recentMoviesResponse.data);

        const trendingMoviesResponse = await axios.get('/movies/flixhq/trending');
        setTrendingMovies(trendingMoviesResponse.data);

        const recentShowsResponse = await axios.get('/movies/flixhq/recent-shows');
        setRecentShows(recentShowsResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);


  if (Loading) {
    return  <Loadingc/>
}



  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;
    navigate(`/movie/search/${searchQuery}`)
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const renderList = (items) => (
    <div className="flex flex-wrap justify-center">
      {items.map(item => (
        <div key={item.id} className="m-4 w-64">
          <img src={item.image} alt={item.title} className="w-full h-96 object-cover rounded-md shadow-lg" />
          <div className="mt-2">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-500">Release Date: {item.releaseDate}</p>
            <p className="text-sm text-gray-500">Duration: {item.duration}</p>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Watch Now</a>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Movie Home</h1>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border rounded-l-md text-black px-4 py-2 w-full max-w-md"
          placeholder="Search for movies or shows..."
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
        >
          Search
        </button>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Movies</h2>
        {recentMovies.length > 0 ? renderList(recentMovies) : <p>Loading...</p>}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Shows</h2>
        {recentShows.length > 0 ? renderList(recentShows) : <p>Loading...</p>}
      </section>
    </div>
  );
}

export default MovieHome;
