import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../../helper/axios';
import Hls from 'hls.js';
import { FaCog } from 'react-icons/fa';

function Episodes() {
  const location = useLocation();

  const Anime = location.state?.Anime;
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEpisodes, setTotalEpisodes] = useState();
  const [selectedQuality, setSelectedQuality] = useState('');
  const [NextEP, setNextEP] = useState('');
  const [Dub, setDub] = useState(false);
  const [dubAvailable, setDubAvailable] = useState(false);
  const [sourceUrl, setSourceUrl] = useState('');
  const [autoPlayNext, setAutoPlayNext] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showQualityOptions, setShowQualityOptions] = useState(false);

  const episodesPerPage = 100;

  const preplay = location.state?.preplayer;
  const id = location.state?.id;

  if (!id && !preplay) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-3xl md:text-5xl font-bold text-center px-4">
          Seems like you're in a hurry! Sorry, hotlinks won't work. Go back and complete the proper steps 😁
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/meta/anilist/info/${id}?fetchFiller=true`);
        setEpisodes(response.data.episodes || []);
        setTotalEpisodes(response.data.currentEpisode);
        
        // Check if nextAiringEpisode exists before attempting to use it
        if (response.data.nextAiringEpisode) {
          let nextEP = (new Date(response.data.nextAiringEpisode.airingTime * 1000)).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          setNextEP(nextEP);
        } else {
          setNextEP('');
        }

        setCurrentEpisode(response.data.episodes[0]);
        checkAheadEpisodes(response.data.episodes);

        if (preplay) {
          const preplayResponse = await axios.get(`/meta/anilist/watch/${preplay}?fetchFiller=true`);
          if (preplayResponse.data.sources.length > 0) {
            setCurrentEpisode(response.data.episodes.find(ep => ep.id === preplayResponse.data.id));
            setSourceUrl(preplayResponse.data.sources[0].url);
            setQualities(preplayResponse.data.sources.filter(source => source.quality !== 'default' && source.quality !== 'backup'));
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id, preplay]);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      if (currentEpisode) {
        setDub(false);
        setDubAvailable(false);
        const episodeId = currentEpisode.id;
        try {
          const response = await axios.get(`/meta/anilist/watch/${episodeId}`);
          if (response.data.sources.length > 0) {
            const sources = response.data.sources.filter(source => source.quality !== 'default' && source.quality !== 'backup');
            const defaultSource = sources.find(source => source.quality === '720p') || sources[sources.length - 1];
            setQualities(sources);
          
            setSelectedQuality(defaultSource.quality);
            setSourceUrl(defaultSource.url);
         
            const dubbedEpisodeId = currentEpisode.id.replace('-episode-', '-dub-episode-');
            const dubResponse = await axios.get(`/meta/anilist/watch/${dubbedEpisodeId}`);
            setDubAvailable(dubResponse.data.sources.length > 0);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchEpisodeData();
  }, [currentEpisode]);

  useEffect(() => {
    if (videoRef.current && sourceUrl) {
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
        const hls = new Hls();
        hls.loadSource(sourceUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.play();
        });
        hlsRef.current = hls;
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = sourceUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play();
        });
      }
    }
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [sourceUrl]);

  const fetchDubbedEpisode = async () => {
    if (currentEpisode) {
      const dubbedEpisodeId = currentEpisode.id.replace('-episode-', '-dub-episode-');
      try {
        const response = await axios.get(`/meta/anilist/watch/${dubbedEpisodeId}`);
        if (response.data.sources.length > 0) {
          setSourceUrl(response.data.sources[0].url);
          const sources = response.data.sources.filter(source => source.quality !== 'default' && source.quality !== 'backup');
          setQualities(sources);
        } else {
          setDubAvailable(false);
        }
      } catch (error) {
        setDubAvailable(false);
        console.error(error);
      }
    }
  };

  const handleEpisodeClick = (episode) => {
    setCurrentEpisode(episode);
  };

  const handleDub = async () => {
    setDub(!Dub);
    if (!Dub) {
      await fetchDubbedEpisode();
    } else {
      const episodeId = currentEpisode.id;
      const response = await axios.get(`/meta/anilist/watch/${episodeId}`);
      const sources = response.data.sources.filter(source => source.quality !== 'default' && source.quality !== 'backup');
      const defaultSource = sources.find(source => source.quality === 'default') || sources[0];
      setQualities(sources);
      setSelectedQuality(defaultSource.quality);
      setSourceUrl(defaultSource.url);
    }
  };

  const handleQualityChange = (quality) => {
    const selectedQuality = qualities.find(q => q.quality === quality);
    setSelectedQuality(quality);
    if (selectedQuality) {
      const currentTime = videoRef.current.currentTime;
      setSourceUrl(selectedQuality.url);
      setTimeout(() => {
        videoRef.current.currentTime = currentTime;
      }, 100);
    }
  };

  const handlePreviousEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex > 0) {
      setCurrentEpisode(episodes[currentIndex - 1]);
    }
  };

  const handleNextEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex < episodes.length - 1) {
      setCurrentEpisode(episodes[currentIndex + 1]);
    }
  };

  const handleAutoPlayToggle = () => {
    setAutoPlayNext(!autoPlayNext);
  };

  const indexOfLastEpisode = currentPage * episodesPerPage;
  const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage;
  const currentEpisodes = episodes.slice(indexOfFirstEpisode, indexOfLastEpisode);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const checkAheadEpisodes = async (episodes) => {
    
    let episodeNumber = parseInt(episodes[episodes.length - 1].number) + 1;
    let aheadEpisodes = [...episodes];
    setLoading(true);
    while (true) {
      const nextEpisodeId = episodes[0].id.replace(/-episode-\d+/, `-episode-${episodeNumber}`);
      try {
        const response = await axios.get(`/meta/anilist/watch/${nextEpisodeId}`);
        if (response.data.sources.length > 0) {
          aheadEpisodes.push({
            id: nextEpisodeId,
            number: episodeNumber
          });
          episodeNumber++;
        } else {
          break;
        }
      } catch (error) {
        break;
      }
   
    } 
    setLoading(false);
    setEpisodes(aheadEpisodes);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      <div className="h-1/3 md:h-full md:w-1/4 overflow-y-auto bg-gray-800 p-4">
        {loading ? (
          <div className="text-center text-red-300 animate-pulse">Loading... This might take time 😢</div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Episodes</h1>
            <div>
              <h2 className="text-xl font-bold mb-2">{Anime}</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
              {currentEpisodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => handleEpisodeClick(episode)}
                  className={`p-2 text-sm rounded ${currentEpisode?.id === episode.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  Ep {episode.number}
                </button>
              ))}
            </div>
            <div className="flex justify-center space-x-2">
              {Array.from({ length: Math.ceil(episodes.length / episodesPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-2 py-1 text-sm rounded ${currentPage === i + 1 ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col md:flex-1 h-2/3 md:h-full bg-gray-900">
        <div className="relative w-full h-full">
          <video
            onEnded={() => {
              if (autoPlayNext) {
                handleNextEpisode();
              }
            }}
            ref={videoRef}
            controls
            className="w-full h-full bg-black"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            {dubAvailable && (
              <button
                onClick={handleDub}
                className={`px-4 py-2 text-sm rounded ${Dub ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'}`}
              >
                {Dub ? 'Sub' : 'Dub'}
              </button>
            )}
            <button
              onClick={handleAutoPlayToggle}
              className={`px-4 py-2 text-sm rounded ${autoPlayNext ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'}`}
            >
              Auto Play: {autoPlayNext ? 'On' : 'Off'}
            </button>
            <button
              onClick={() => setShowQualityOptions(!showQualityOptions)}
              className="px-4 py-2 text-sm rounded bg-gray-600 hover:bg-gray-500"
            >
              <FaCog />
            </button>
          </div>
          {showQualityOptions && (
            <div className="absolute top-12 right-4 bg-gray-700 p-4 rounded shadow-md">
              <h3 className="text-lg mb-2">Select Quality:</h3>
              <ul>
                {qualities.map((quality) => (
                  <li key={quality.quality}>
                    <button
                      onClick={() => handleQualityChange(quality.quality)}
                      className={`px-4 py-2 text-sm rounded mb-2 ${selectedQuality === quality.quality ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                    >
                      {quality.quality}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex justify-between bg-gray-800 p-4">
          <button onClick={handlePreviousEpisode} className="px-4 py-2 text-sm rounded bg-gray-600 hover:bg-gray-500">
            Previous
          </button>
          {NextEP ? (
            <span className="text-lg text-green-400 font-bold">Next Episode Airing: {NextEP}</span>
          ) : null}
          <button onClick={handleNextEpisode} className="px-4 py-2 text-sm rounded bg-gray-600 hover:bg-gray-500">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Episodes;
