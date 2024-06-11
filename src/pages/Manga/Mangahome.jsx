import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loadingc from '../../Components/Loading';



function MangaPage() {
  const [mangaList, setMangaList] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [neverShow, setNeverShow] = useState(false);
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const Url = 'https://manga-api-vercel.vercel.app/api/mangalist';
  useEffect(() => {
    const fetchData = async () => {
      
      setLoading(true);
      await axios.get(Url)
        .then((response) => {
          console.log(response.data);
          setMangaList(response.data.mangaList);
        })
        .catch((error) => {
          console.error('Error fetching data: ', error);
        });
        setLoading(false);
      };
   
    fetchData();

    const neverShowPopup = localStorage.getItem('neverShowPopup');
    if (!neverShowPopup) {
      setShowPopup(true);
    }
  }, [page]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    if (neverShow) {
      localStorage.setItem('neverShowPopup', 'true');
    }
  };


  return (
    <div>
      {
        Loading? <Loadingc /> : <>{showPopup && (
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
    )
    }</>}

    {
      mangaList.length !== 0 && !Loading && <div className=" container mx-auto  h-screen">
        <form onSubmit={(event) => {
            event.preventDefault();
            navigate(`/searchmanga/${searchTerm.replace(/ /g, '-').toLowerCase()}`);
            }} 
            className="flex flex-col md:flex-row items-center justify-between py-4 px-2 md:px-0 bg-gray-900 text-white">
            <h1 className="text-4xl text-center md:text-left mb-4 md:mb-0 w-full font-bold">Depressed Zone</h1>
            <input type="text" placeholder="Search anime..." value={searchTerm} onChange={handleSearch} className="px-2 py-1 rounded border border-gray-300 w-full md:w-auto bg-white text-gray-900" />
            <input type="submit" value="Search" className="mt-2 md:mt-0 md:ml-2 px-2 py-1 rounded bg-white text-gray-900 cursor-pointer" />
        </form>
      <h1 className="text-4xl text-center py-4 bg-gray-900 text-white font-bold">Manga List</h1>
    
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
        {mangaList.map((manga) => (
          <div onClick={()=>{
            navigate(`/mangainfo/${manga.id}`);
          }}  key={manga.id} className="border p-4 rounded shadow">
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
    </div>}
  </div> );
}

export default MangaPage;