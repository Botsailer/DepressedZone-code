import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from '../../helper/axios/index';
import Loadingc from '../../Components/Loading';

function AnimeList() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const fetchFiller = searchParams.get('fetchFiller');
  const dub = searchParams.get('dub');
  const [anime, setAnime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/meta/anilist/info/${id}?fetchFiller=true&dub=${dub}`);
      setAnime(response.data);
      //console.log(response.data);
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
      <h1 className="text-4xl font-bold mb-4">{anime.title.english}</h1>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img src={anime.image} alt={anime.title} className="w-1/2 h-auto mb-4" />
          <h2 className="text-xl mt-3 font-bold mb-2">Characters</h2>
          <div className="flex flex-row h-60 overflow-x-scroll gap-2">
        
            {anime.characters.map((character) => (
              <div key={character.id} className="flex flex-col items-center mb-4">
                <img src={character.image} alt={character.name.userPreferred} className=" mt-8 w-16 h-16 rounded-full mr-2" />
                <div >
                  <h3 className="font-bold">{character.name.userPreferred}</h3>
               
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:w-2/3 md:pl-8">
          <p className="text-lg mb-4" dangerouslySetInnerHTML={renderDescription()} />
          <div className="mb-4">
            <span className="font-bold">Also Known as:</span>
            <span className="ml-2">{anime.title.native}, {anime.title.romaji}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Type:</span> <span className="ml-2">{anime.type}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Episodes:</span> <span className="ml-2">{anime.totalEpisodes}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Status:</span> <span className="ml-2">{anime.status}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Genres:</span>
            <div className="flex flex-wrap mt-2">
              {anime.genres.map((genre) => (
                <Link
                  to={`/anime/genres/${genre}`}
                  key={genre}
                  className="m-1 p-1 bg-blue-500 text-white text-xs rounded"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <span className="font-bold">Released:</span> <span className="ml-2">{anime.releaseDate}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Sub or Dub:</span> <span className="ml-2">{anime.subOrDub}</span>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
            onClick={() => navigate('/episodes', { state: { id: anime.id , Anime:anime.title.english } })}
          >
            View Now
          </button>
        </div>
      </div>
      <div className="md:w-full md:pl-8 mt-8">
        <h2 className="text-2xl font-bold mb-4">Recommended Anime</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {anime.recommendations.map((related) => (
            <div
            onClick={() => navigate(`/anime/${related.id}?fetchFiller=true`)}
            key={related.id} className="flex flex-col items-center mb-4">
              <img src={related.image} alt={related.title.english} className="w-24 h-32 rounded" />
              <div className="mt-2 text-center">
                <h3 className="font-bold">{related.title.english}</h3>
                <p className="text-sm">Released Year {related.releaseDate}</p>
                <p className="text-sm">Episodes {related.totalEpisodes}</p>
                <p className="text-sm">Rating {related.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnimeList;
