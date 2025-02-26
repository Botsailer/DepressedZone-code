import React, { useEffect, useState } from 'react';
import axios from '../../helper/axios';
import Loadingc from '../../Components/Loading';
import { useNavigate } from 'react-router-dom';

function MovieHome() {
  const [recentMovies, setRecentMovies] = useState([]);
  const [recentShows, setRecentShows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const recentMoviesResponse = await axios.get('/movies/flixhq/recent-movies');
        setRecentMovies(recentMoviesResponse.data);

        const recentShowsResponse = await axios.get('/movies/flixhq/recent-shows');
        setRecentShows(recentShowsResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loadingc />;
  }

  const handleSearch = () => {
    if (searchQuery.trim() === '') return;
    navigate(`/movie/search/${searchQuery}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const MovieCard = ({ item }) => (
    <div className="relative group w-64 m-4 transform transition-all duration-300 hover:scale-105">
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-900">
        {/* Image Container */}
        <div className="relative h-96">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
            <button 
              onClick={() => navigate(`/movie/info?id=${item.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transform transition-all duration-300 hover:scale-105"
            >
              View Details
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 bg-gray-900">
          <h3 className="text-lg font-semibold text-white truncate">{item.title}</h3>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>{item.releaseDate}</span>
              <span>{item.duration}</span>
            </div>
            {item.type === 'TV Series' && (
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>{item.season}</span>
                <span>{item.latestEpisode}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => navigate(`/watch/${item.id}`)}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transform transition hover:scale-110"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );

  const renderList = (items) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
      {items.map(item => (
        <MovieCard key={item.id} item={item} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Hero Section */}
      <div className="relative mb-12 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Movies & TV Shows</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-6 py-4 text-lg text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search for movies or shows..."
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-300"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6 pl-4 border-l-4 border-blue-600">
            Recent Movies
          </h2>
          {recentMovies.length > 0 ? renderList(recentMovies) : 
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Loading movies...</p>
            </div>
          }
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 pl-4 border-l-4 border-purple-600">
            Recent Shows
          </h2>
          {recentShows.length > 0 ? renderList(recentShows) : 
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Loading shows...</p>
            </div>
          }
        </section>
      </div>
    </div>
  );
}

export default MovieHome;