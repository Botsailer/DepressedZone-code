import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../helper/axios';
import Loadingc from '../../Components/Loading';

function MovieInfo() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const id = searchParams.get('Id');
    const navigate = useNavigate();
  useEffect(() => {
    console.log(id);
    const fetchData = async () => {
      try {
        setLoading(true);
        const searchResponse = await axios.get(`/movies/flixhq/info?id=${id}`);
        console.log(searchResponse.data);
        setResults(searchResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (id === 'undefined') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-4xl">Oops! Page not found maybe you skipped a step.</h2>
        <p className="mt-4 text-xl">We are legally blind.</p>
        <p className="mt-4 text-xl">But don't worry, here's the solution: put a query in the URL.</p>
        <img
          className="w-64 h-64 mt-8"
          src="https://i.imgur.com/qIufhof.png"
          alt="Barigade: I have no idea what I'm doing"
        />
      </div>
    );
  }

  if (loading) {
    return <Loadingc />;
  }

  if (!results) {
    return <div>No data found.</div>;
  }

  const { title, description, image, cover, rating, duration, releaseDate, genres, casts } = results;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        <img src={cover} alt={title} className="w-full md:w-1/3 rounded-lg" />
        <div className="md:ml-8 mt-4 md:mt-0 flex-1">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 ">{description}</p>
          <p className="mt-4"><strong>Rating:</strong> {rating}</p>
          <p className="mt-2"><strong>Duration:</strong> {duration}</p>
          <p className="mt-2"><strong>Release Date:</strong> {releaseDate}</p>
          <p className="mt-2"><strong>Genres:</strong> {genres.join(', ')}</p>
          <p className="mt-2"><strong>Cast:</strong> {casts.join(', ')}</p>
        </div>
   
      </div>
      <div className="flex justify-center mt-4">
    <button onClick={
        ()=>{
            window.open(results.url, "_blank")
        }
    } className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Watch now
    </button>
</div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Recommendations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {results.recommendations.map(rec => (
            <div key={rec.id} className=" p-2 rounded-lg">
              <img src={rec.image} alt={rec.title} className="rounded-lg" />
              <p className="mt-2 text-center">{rec.title}</p>
              <span className="text-center text-sm"> Type : {rec.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieInfo;
