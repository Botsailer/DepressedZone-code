import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JWPLAYER_CDN = "https://cdn.jwplayer.com/libraries/IDzF9Zmk.js"; // Sample free JW Player library URL

// Helper to dynamically load the JW Player script if it hasn't been loaded yet.
const loadJWPlayerScript = () => {
  return new Promise((resolve, reject) => {
    if (window.jwplayer) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = JWPLAYER_CDN;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load JW Player script"));
    document.body.appendChild(script);
  });
};

const WatchMovie = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const episodeIdParam = queryParams.get('episodeId');
  const mediaId = queryParams.get('mediaId');

  const playerRef = useRef(null);

  // States for API data and UI
  const [currentEpisodeId, setCurrentEpisodeId] = useState(episodeIdParam);
  const [episodes, setEpisodes] = useState([]);
  const [sources, setSources] = useState([]);
  const [subtitles, setSubtitles] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch episodes info for the given mediaId
  useEffect(() => {
    if (!mediaId) return;
    axios
      .get(`/movies/flixhq/info?id=${mediaId}`)
      .then((response) => {
        if (response.data.episodes) {
          setEpisodes(response.data.episodes);
        }
      })
      .catch((err) => console.error('Error fetching episodes:', err));
  }, [mediaId]);

  // Fetch video sources and subtitles for the current episode
  useEffect(() => {
    if (!currentEpisodeId || !mediaId) return;
    setLoading(true);
    axios
      .get(`/movies/flixhq/watch?episodeId=${currentEpisodeId}&mediaId=${mediaId}`)
      .then((response) => {
        const { sources: fetchedSources = [], subtitles: fetchedSubtitles = [] } = response.data;
        setSources(fetchedSources);
        setSubtitles(fetchedSubtitles);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching video data:', error);
        setError('Failed to load video');
        setLoading(false);
      });
  }, [currentEpisodeId, mediaId]);

  // Load JW Player script and initialize the player when sources are available
  useEffect(() => {
    if (loading || sources.length === 0) return;

    loadJWPlayerScript()
      .then(() => {
        // Make sure the target container is available
        const playerContainer = document.getElementById('player');
        if (!playerContainer) return;

        // Initialize JW Player
        const player = window.jwplayer('player');
        player.setup({
          autostart: false,
          // Create a playlist with multiple source qualities and captions tracks
          playlist: [{
            sources: sources.map(source => ({
              file: source.url,
              label: source.quality
            })),
            tracks: subtitles.map(track => ({
              file: track.url,
              label: track.lang,
              kind: "captions"
            }))
          }],
          captions: {
            color: "#FFFFFF",
            fontSize: 14,
            backgroundOpacity: 75,
            backgroundColor: "#000000",
            edgeStyle: "raised"
          }
        });
        playerRef.current = player;
      })
      .catch((err) => {
        console.error("JW Player failed to load:", err);
        setError("Video player failed to initialize.");
      });

    // Cleanup the player on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.remove();
      }
    };
  }, [sources, subtitles, loading]);

  // Handler to switch episodes
  const handleEpisodeSelect = (episode) => {
    if (playerRef.current) {
      playerRef.current.stop();
    }
    setCurrentEpisode(episode);
    setCurrentEpisodeId(episode.id);
    navigate(`/movie/watch?episodeId=${episode.id}&mediaId=${mediaId}`, { replace: true });
    setLoading(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-4">{error}</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto">
        {/* Video Player Container */}
        <div className="relative aspect-video mb-6">
          <div id="player"></div>
        </div>
        
        {/* Episodes List (if available) */}
        {episodes.length > 1 ? (
          <div className="mt-8">
            <h2 className="text-white text-2xl font-bold mb-4">Episodes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {episodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => handleEpisodeSelect(episode)}
                  className={`p-4 rounded-lg transition ${
                    currentEpisodeId === episode.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm font-medium">{episode.title}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // If only one episode exists, show a "Watch Now" button
          episodes.length === 1 && (
            <button
              onClick={() =>
                navigate(`/movie/watch?episodeId=${episodes[0].id}&mediaId=${mediaId}`)
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105"
            >
              Watch Now
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default WatchMovie;
