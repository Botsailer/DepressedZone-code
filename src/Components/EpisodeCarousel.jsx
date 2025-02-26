import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate } from 'react-router-dom';
import axios from '../helper/axios';

const EpisodeCarousel = ({ episodes }) => {
  const navigate = useNavigate();
  const [episodeData, setEpisodeData] = useState([]);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        const results = await Promise.all(
          episodes.map(async (episode) => {
            const response = await axios.get(`/meta/anilist/${episode.id}`);
            const details = response.data.results.length > 0 ? response.data.results[0] : {};
            return { ...episode, details };
          })
        );
        setEpisodeData(results);
        console.log(results);
      } catch (error) {
        console.error('Error fetching episode data:', error);
      }
    };

    fetchEpisodeData();
  }, [episodes]);

  return (
    <Carousel
      showArrows={true}
      showStatus={false}
      showThumbs={false}
      infiniteLoop={true}
      autoPlay={true}
      interval={5000}
      transitionTime={500}
      swipeable={true}
      emulateTouch={true}
      className="w-full"
    >
      {episodeData.map((episode) => (
        <div
          key={episode.id}
          className="relative h-96 cursor-pointer"
          onClick={() => navigate(`/episodes`, { state: { preplayer: episode.episodeId, id: episode.details.id, Anime: episode.title } })}
        >
          <img src={episode.image} alt={episode.title} className="object-scale-down h-full" />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-end p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{episode.title}</h2>
            <p className="text-xl mb-4">Episode: {episode.episodeNumber}</p>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default EpisodeCarousel;
