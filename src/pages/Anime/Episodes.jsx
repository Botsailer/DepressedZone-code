import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../../helper/axios';
import Hls from 'hls.js';
import Loadingc from '../../Components/Loading';

function Episodes() {
  const location = useLocation();
  const episodes = location.state;
  const preplay = location.state?.preplayer;

  const [currentEpisode, setCurrentEpisode] = useState(episodes[0]);
  const [qualities, setQualities] = useState([]);
  const [SelectedQuality, setSelectedQuality] = useState('');
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      if (preplay) {
        let Url = `/anime/gogoanime/watch/${preplay}`;
        console.log(`Fetching data for preplay ID: ${preplay}`);
        const response = await axios.get(Url, { params: { server: "gogocdn" } });
        console.log(response.data);
        const sources = response.data.sources;

        if (sources && sources.length > 0) {
          const defaultSource = sources.find(source => source.quality === 'default') || sources[0];
          setQualities(sources);
          setSelectedQuality(defaultSource.quality);
          setupHls(defaultSource.url);
        }
      } else if (episodes.length === 1) {
        setCurrentEpisode(episodes[0]);
      } else {
        setCurrentEpisode(episodes[0]);
      }
    };
    fetchData();
  }, [episodes, preplay]);

  useEffect(() => {
    if (currentEpisode) {
      let Url = `/anime/gogoanime/watch/${currentEpisode.id}`;
      console.log(`Fetching data for episode ID: ${currentEpisode.id}`);
      const fetchData = async () => {
        const response = await axios.get(Url, { params: { server: "gogocdn" } });
        console.log(response.data);
        const sources = response.data.sources;

        if (sources && sources.length > 0) {
          const defaultSource = sources.find(source => source.quality === 'default') || sources[sources.length - 3];
          setQualities(sources);
          setSelectedQuality(defaultSource.quality);
          setupHls(defaultSource.url);
        }
      };
      fetchData();
    }
  }, [currentEpisode]);

  const setupHls = (url) => {
    console.log("Setting up HLS with URL:", url);
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

      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        hlsRef.current.autoLevelEnabled = true;
      });

      hlsRef.current.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const newQuality = qualities[data.level].quality;
        setSelectedQuality(newQuality);
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = url;
    }
  };

  const handleEpisodeClick = (episode) => {
    setCurrentEpisode(episode);
    console.log(`Selected episode: ${episode.title}`);
  };

  const handleQualityChange = (quality) => {
    console.log("Selected quality:", quality);
    const selectedQualitys = qualities.find(q => q.quality === quality);
    console.log("Selected quality object:", selectedQualitys);
    setSelectedQuality(quality)
    if (selectedQualitys) {
      setupHls(selectedQualitys.url);
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

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900">
      <div className="md:w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Episodes</h1>
        <div className="flex flex-col space-y-2">
          {episodes.length > 1 &&
            episodes.map((episode, index) => (
              <div
                key={index}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer"
                onClick={() => handleEpisodeClick(episode)}
              >
                <p className="text-lg font-semibold">Episode {episode.number}</p>
                <p className="text-sm text-gray-300">{episode.title}</p>
              </div>
            ))
          }
        </div>
      </div>
      <div className="md:w-3/4 flex flex-col items-center justify-center">
        {qualities.length > 0 ? (
          <>
            <div className="relative w-full h-0" style={{ paddingBottom: '56.25%' }}>
              <video ref={videoRef} autoPlay controls width="100%" height="100%" className="absolute top-0 left-0 w-full h-full rounded-md shadow-lg" />
              <div className="absolute top-0 right-0 p-2 flex space-x-2 bg-gray-800 bg-opacity-75 rounded-bl-md">
                {qualities.filter(q => q.quality !== 'default' && q.quality !== 'backup').map((quality, index) => (
                  <button
                    key={index}
                    onClick={() => handleQualityChange(quality.quality)}
                    className={`bg-gray-700 text-white py-1 px-2 rounded text-sm ${SelectedQuality === quality.quality ? 'ring-2 ring-white' : ''
                      }`}
                  >
                    {quality.quality}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between w-full mt-4 px-4">
              {currentEpisode !== episodes[0] &&
                <button onClick={handlePreviousEpisode} disabled={currentEpisode === episodes[0]} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-500">
                  Previous
                </button>
              }
              {
                currentEpisode !== episodes[episodes.length - 1] && (
                  <button onClick={handleNextEpisode} disabled={currentEpisode === episodes[episodes.length - 1]} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-500">
                    Next
                  </button>
                )
              }
            </div>
          </>
        ) : (
          <Loadingc />
        )}
      </div>
    </div>
  );
}

export default Episodes;
