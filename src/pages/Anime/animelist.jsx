import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../../helper/axios/index';
import Loadingc from '../../Components/Loading';


function AnimeList() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {

    const fetchData = async () => {
      const response = await axios.get(`/anime/gogoanime/info/${id}`);
      setAnime(response.data);
      console.log(response.data);
      window.scrollTo(0, 0);
    };
    fetchData();
  }, [id]);

  if (!anime) {

    return <Loadingc />;

  }

  const renderDescription = () => {
    return { __html: anime.description };
  };



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{anime.title}</h1>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-full">
          <img src={anime.image} alt={anime.title} className="w-1/2 h-auto mb-4" />
        </div>
        <div className="md:w-2/3 md:pl-8">
          <p className="text-lg mb-4" dangerouslySetInnerHTML={renderDescription()} />
          <div className="mb-4">
            <span className="font-bold">Also Known as :</span> {anime.otherName}
          </div>
          <div className="mb-4">
            <span className="font-bold">Type:</span> {anime.type}
          </div>
          <div className="mb-4">
            <span className="font-bold">Episodes:</span> {anime.totalEpisodes}
          </div>
          <div className="mb-4">
            <span className="font-bold">Status:</span> {anime.status}
          </div>
          <div className="mb-4">
            <span className="font-bold">Genres:</span> {anime.genres.map((genre) => {
              return (
                <Link to={`/anime/genres/${genre}`} key={genre} className="m-1 p-1 bg-blue-500 text-white text-xs rounded">{genre}</Link>
              );
            })}
          </div>
          <div className="mb-4">
            <span className="font-bold">Released:</span> {anime.releaseDate}
          </div>
          <div className="mb-4">
            <span className="font-bold">Sub or Dub:</span> {anime.subOrDub}
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={() => navigate('/episodes', { state: anime.episodes })}>
            View Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnimeList;
