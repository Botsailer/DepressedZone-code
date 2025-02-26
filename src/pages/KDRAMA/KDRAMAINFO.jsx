import React, { useEffect, useState } from 'react';
import axios from '../../helper/axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loadingc from '../../Components/Loading';

const KDRAMAINFO = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [dramaInfo, setDramaInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/movies/dramacool/info?id=${id}`);
        setDramaInfo(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleWatchNow = () => {
    navigate(`/KdramaWatch`, { state: { id: id, episodes: dramaInfo.episodes } });
  };

  if (!dramaInfo) {
    return <Loadingc />;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="shadow-lg rounded-lg overflow-hidden sm:flex">
          <div className="sm:w-1/3">
            <img
              src={dramaInfo.image}
              alt={dramaInfo.title}
              className="w-full h-64 object-cover sm:h-auto"
            />
          </div>
          <div className="p-6 sm:w-2/3 bg-white">
            <h2 className="text-2xl font-bold mb-2">{dramaInfo.title}</h2>
            <p className="mb-4 text-gray-700">{dramaInfo.description}</p>
            <p className="mb-2">
              <span className="font-bold">Status:</span> {dramaInfo.status}
            </p>
            <p className="mb-2">
              <span className="font-bold">Genres:</span> {dramaInfo.genres.join(', ')}
            </p>
            <p className="mb-2">
              <span className="font-bold">Other Names:</span> {dramaInfo.otherNames.join(', ')}
            </p>
            <p className="mb-4">
              <span className="font-bold">Release Date:</span> {dramaInfo.releaseDate}
            </p>
            <button
              onClick={handleWatchNow}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Watch Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KDRAMAINFO;