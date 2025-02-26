import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../helper/axios';
import Loadingc from '../../Components/Loading';
import { useLocation } from 'react-router-dom';
const MovieInfo = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get('id');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [movieData, setMovieData] = useState(null);
  const parallaxRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect
  useEffect(() => {

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) {
        toast.error('Missing movie ID');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/movies/flixhq/info?id=${id}`)
        setMovieData(response.data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch movie data');
        console.error('Error fetching movie data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) return <Loadingc />;

  if (!movieData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">No Movie Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    image,
    cover,
    rating,
    duration,
    releaseDate,
    genres,
    casts,
    recommendations,
    production,
    country,
    episodes
  } = movieData;
  console.log(movieData);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ToastContainer position="top-right" theme="dark" />
      
      {/* Parallax Hero Section */}
      <div 
        ref={parallaxRef}
        className="relative h-[70vh] overflow-hidden"
      >
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            backgroundImage: `url(${cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="container mx-auto flex flex-col md:flex-row items-end gap-8">
            <div className="w-64 flex-shrink-0 transform hover:scale-105 transition duration-300">
              <img 
                src={image} 
                alt={title}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
            
            <div className="flex-grow">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">{title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-lg opacity-90">
                <span>{releaseDate}</span>
                <span>•</span>
                <span>{duration}</span>
                <span>•</span>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg transform hover:scale-[1.01] transition">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{description}</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg transform hover:scale-[1.01] transition">
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <div className="flex flex-wrap gap-3">
                {casts.map(actor => (
                  <span 
                    key={actor}
                    className="px-4 py-2 bg-gray-700 rounded-full text-sm hover:bg-gray-600 transition cursor-pointer"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Movie Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Production:</span>
                  <p>{production}</p>
                </div>
                <div>
                  <span className="text-gray-400">Country:</span>
                  <p>{country}</p>
                </div>
                <div>
                  <span className="text-gray-400">Genres:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {genres.map(genre => (
                      <span 
                        key={genre}
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {episodes.length > 1 ? (
  <div className="space-y-4">
    <h3 className="text-xl font-bold">Episodes</h3>
    <div className="grid grid-cols-2 gap-2">
      {episodes.map((episode) => (
        <button 
          key={episode.id}
          onClick={() => navigate(`/movie/watch?episodeId=${episode.id}&mediaId=${id}`)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {episode.title}
        </button>
      ))}
    </div>
  </div>
) : (
  <button 
    onClick={() => navigate(`/movie/watch?episodeId=${episodes[0].id}&mediaId=${id}`)}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105"
  >
    Watch Now
  </button>
)}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommendations.map(movie => (
              <div 
                key={movie.id}
                className="group cursor-pointer transform hover:scale-105 transition duration-300"
                onClick={() => navigate(`/movie/info/${movie.id}`)}
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold">{movie.title}</h3>
                      <p className="text-gray-300 text-sm">{movie.duration} min</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add some CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MovieInfo;