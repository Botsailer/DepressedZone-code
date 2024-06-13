import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loadingc from '../../Components/Loading';

const FilterComponent = ({ setFilters, metaData }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState('latest');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const applyFilters = () => {
    setFilters({
      type: selectedType,
      status: selectedStatus,
      genre: selectedGenre,
    });
    setShowFilters(false);
  };

  return (
    <div className="container mx-auto px-4">
   <div className="flex justify-end mb-4">
  <button
    className="px-4 py-2 bg-gray-200 rounded-md text-gray-500 hover:bg-gray-300 focus:outline-none focus:bg-gray-400"
    onClick={() => setShowFilters(!showFilters)}
  >
    {showFilters ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
          clipRule="evenodd"
        />
      </svg>
    )}
  </button>
</div>
      {showFilters && (
        <div className=" rounded-md shadow-md p-4 mt-4">
          <div className="mb-4">
            <label className="block text-red-700 font-bold mb-2">Type</label>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="block w-full p-2 bg-white border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {metaData.type.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-red-700 font-bold mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="block w-full p-2 bg-white border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {metaData.state.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-red-700 font-bold mb-2">Genre</label>
            <select
              value={selectedGenre}
              onChange={handleGenreChange}
              className="block w-full p-2 bg-white border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {metaData.category.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-800"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function MangaPage() {
  const [mangaList, setMangaList] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [neverShow, setNeverShow] = useState(false);
  const [metaData, setMetaData] = useState({})
  const [Loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'latest',
    status: 'all',
    genre: 'all',
  });
  const navigate = useNavigate();

  const fetchMangaList = async () => {
    setLoading(true);
    const { type, status, genre } = filters;
    const url = `https://manga-api-vercel.vercel.app/api/mangalist?type=${type}&category=${genre}&state=${status}&page=${page}`;
   console.log(url);
    try {
      const response = await axios.get(url);
      setMangaList(response.data.mangaList);
      setMetaData(response.data.metaData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMangaList();
  }, [filters, page]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    if (neverShow) {
      localStorage.setItem('neverShowPopup', 'true');
    }
  };

  useEffect(() => {
    const neverShowPopup = localStorage.getItem('neverShowPopup');
    if (!neverShowPopup) {
      setShowPopup(true);
    }
  }, []);

  return (
    <div>
      {Loading ? <Loadingc /> : (
        <>
          {showPopup && (
            <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 text-center " id="modal-title">
                          Attention
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-black">
                            Your request Might be slow due to the server being hosted on a fucking Teensy 4.1 with Fucking 32 MB Ram. Please be patient.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleClosePopup}>
                      OK
                    </button>
                    <div className="mt-2 sm:mt-0 sm:w-auto sm:text-sm flex items-center">
                      <input id="never-show" name="never-show" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={neverShow} onChange={() => setNeverShow(!neverShow)} />
                      <label htmlFor="never-show" className="ml-2 block text-sm text-gray-900">
                        Never show again
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="container mx-auto h-screen">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                navigate(`/searchmanga/${searchTerm.replace(/ /g, '-').toLowerCase()}`);
              }}
              className="flex flex-col md:flex-row items-center justify-between py-4 px-2 md:px-0 bg-gray-900 text-white"
            >
              <h1 className="text-4xl text-center md:text-left mb-4 md:mb-0 w-full font-bold">Depressed Zone</h1>
              <input
                type="text"
                placeholder="Search anime..."
                value={searchTerm}
                onChange={handleSearch}
                className="px-2 py-1 rounded border border-gray-300 w-full md:w-auto bg-white text-gray-900"
              />
              <input
                type="submit"
                value="Search"
                className="mt-2 md:mt-0 md:ml-2 px-2 py-1 rounded bg-white text-gray-900 cursor-pointer"
              />
            </form>
            <FilterComponent setFilters={setFilters} metaData={metaData} />
            <h1 className="text-4xl text-center py-4 bg-gray-900 text-white font-bold">Manga List</h1>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
              {mangaList.map((manga) => (
                <div
                  onClick={() => {
                    navigate(`/mangainfo/${manga.id}`);
                  }}
                  key={manga.id}
                  className="border p-4  rounded shadow cursor-pointer"
                >
                  <div className="flex justify-center">
                    <img
                      src={manga.image}
                      alt={manga.title}
                      className="w-48 h-auto rounded mb-4"
                    />
                  </div>
                  <h2 className="text-xl font-bold mb-2">{manga.title}</h2>
                  <p className="mb-2">
                    <strong>Chapter:</strong> {manga.chapter}
                  </p>
                  <p className="mb-2">
                    <strong>Views:</strong> {manga.view}
                  </p>
                </div>
              ))}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default MangaPage;
