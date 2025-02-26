import React, { useEffect, useState } from 'react';
import axios from '../../helper/axios';
import { useNavigate } from 'react-router-dom';

const KDRAMAHOME = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(true);

  const navigate = useNavigate();

  const handleSearch = async (event) => {
    event.preventDefault();
    setSearch(search.trim());
    try {
      const response = await axios.get(`/movies/dramacool/${search}`);
      setData(response.data.results);
      setShowSearchBar(false); 
    } catch (error) {
      console.log(error);
      setData([]);
      setShowSearchBar(true);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white">
      {showSearchBar ? (
        <div className="flex justify-center items-center h-screen">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Search Kdrama"
              required
              className="border-2 border-gray-600 bg-gray-900 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none text-white placeholder:text-gray-400 focus:border-purple-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Search
            </button>
          </form>
        </div>
      ) : (
        <div className="flex justify-end p-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search Kdrama"
              className="border-2 border-gray-600 bg-gray-900 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none text-white placeholder:text-gray-400 focus:border-purple-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {data.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/Kdramainfo?id=${item.id}`)}
              className="flex flex-col items-center bg-gray-700 rounded-lg shadow-md overflow-hidden cursor-pointer"
            >
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h1 className="text-center text-lg font-semibold">{item.title}</h1>
              </div>
            </div>
          ))}
        </div>
     ) : data.length === 0 && showSearchBar ? (
      <div className="flex justify-center items-center h-full">
        <p className="font-bold">No results found. Please check your spelling and try again.</p>
      </div>
    ) : null}
  </div>
);
};


export default KDRAMAHOME;