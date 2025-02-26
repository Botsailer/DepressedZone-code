import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../helper/axios';
import Hls from 'hls.js';
import Loadingc from '../../Components/Loading';

function KDRAMAEPISODES() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const { id, episodes } = location.state;

  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [autoPlayNext, setAutoPlayNext] = useState(false);

  useEffect(() => {
    if (!id) {
      return <div className="fixed top-1/2 left-1/2 w-full h-full overflow-hidden">
        <h1 className='text-center font-bold '>Seems like you skipped a step </h1>
      </div>
    }
    if (episodes && episodes.length > 0) {
      setCurrentEpisode(episodes[0]);
    }
  }, [id, episodes, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentEpisode) {
        const response = await axios.get(`/movies/dramacool/watch?episodeId=${currentEpisode.id}&mediaId=${id}`);
    //console.log(response.data);
        const sources = response.data.sources;

        if (sources && sources.length > 0) {
          const defaultSource = sources.find(source => source.quality === 'default') || sources[0];
          setSourceUrl(defaultSource.url);
        }
      }
    };

    fetchData();
  }, [currentEpisode]);

  useEffect(() => {
    if (videoRef.current && sourceUrl) {
      setupHls(sourceUrl);
    }
  }, [sourceUrl, videoRef]);

  const setupHls = (url) => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (Hls.isSupported()) {
      hlsRef.current = new Hls({
        capLevelToPlayerSize: true,
        autoLevelCapping: -1,
      });

      hlsRef.current.loadSource(url);
      hlsRef.current.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = url;
    }
  };

  const handleEpisodeClick = (episode) => {
    setCurrentEpisode(episode);
  };

  const handlePreviousEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex > 0) {
      setCurrentEpisode(episodes[currentIndex - 1]);
    }
  };

  const handleAutoPlayToggle = () => {
    setAutoPlayNext(!autoPlayNext);
  };

  const handleNextEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex < episodes.length - 1) {
      setCurrentEpisode(episodes[currentIndex + 1]);
    }
  };

  if (!episodes || !episodes.length || !id || !id.length) {
    return <div className=' text-center  '>Hmmmmm seems wrong maybe a skipped step? </div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-gray-900">
        <div className="h-full md:w-1/5 overflow-y-auto bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-bold mb-4">Episodes</h1>
          <div className="flex flex-col space-y-2">
            {episodes.map((episode, index) => (
              <div
                key={index}
                className={`py-2 px-4 flex flex-grow bg-gray-700 hover:bg-gray-600 rounded cursor-pointer ${currentEpisode?.id === episode.id ? 'bg-green-500' : ''}`}
                onClick={() => handleEpisodeClick(episode)}
              >
                <p className="text-sm text-gray-300">{episode.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="h-full md:w-4/5 flex flex-col items-center justify-center">
          {sourceUrl ? (
            <>
              <div className="relative w-full h-0" style={{ paddingBottom: '56.25%' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  controls
                  width="100%"
                  height="100%"
                  className="absolute top-0 left-0 w-full h-full rounded-md shadow-lg"
                  onEnded={autoPlayNext ? handleNextEpisode : null}
                />
              </div>

              <div className="flex justify-between w-full mt-4 px-4">
                {currentEpisode !== episodes[0] &&
                  <button onClick={handlePreviousEpisode} disabled={currentEpisode === episodes[0]} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-500">
                    Previous
                  </button>
                }
                <div className="flex items-center">
                  <span className="mr-3 text-white">Autoplay Next:</span>
                  <label htmlFor="autoplay-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="autoplay-toggle"
                        className="sr-only"
                        checked={autoPlayNext}
                        onChange={handleAutoPlayToggle}
                      />
                      <div className="w-10 h-6 bg-gray-400 rounded-full shadow-inner"></div>
                      <div
                        className={`absolute w-5 h-5 bg-white rounded-full shadow inset-y-0.5 left-0 transform transition ${autoPlayNext ? 'translate-x-5 bg-green-500' : 'translate-x-0'}`}
                      ></div>
                    </div>
                  </label>
                </div>
                {currentEpisode !== episodes[episodes.length - 1] && (
                  <button onClick={handleNextEpisode} disabled={currentEpisode === episodes[episodes.length - 1]} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-500">
                    Next
                  </button>
                )}
              </div>
            </>
          ) : (
            <Loadingc />
          )}
        </div>
      </div>
    </>
  );
}

export default KDRAMAEPISODES;