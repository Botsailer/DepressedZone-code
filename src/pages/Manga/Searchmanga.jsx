import React, { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../helper/axios';
import Loadingc from '../../Components/Loading';






function Searchmanga() {
    const { manga } = useParams();
    const [mangaList, setMangaList] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [TotalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
  
  useEffect(() => {
  
    if (!manga) {
        return window.location.href = '/manga';
    }

    const fetchData = async() =>  {
      setLoading(true);
        await axios.get(`https://manga-api-vercel.vercel.app/api/search/${manga}?page=${currentPage}`).then((response) => {
            console.log(response.data);
            setMangaList(response.data.mangaList);
            setTotalPages(response.data.metaData.totalPages);
            
        }).catch((error) => {
            console.error('Error fetching data: ', error);
        })
        setLoading(false);
    }
    fetchData();

  }, [manga, currentPage]);
  
  
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  
  
  return (
  Loading ? <Loadingc/> :
  
  
  <>
  
    <div>Searchmanga : - {manga}</div>
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
    {mangaList.map((mangaItem, index) => (
                    <div 
                        key={index} 
                        className="border p-4 rounded shadow cursor-pointer"
                        onClick={() => navigate(`/mangainfo/${mangaItem.id}`)}
                    >
            <div className="flex justify-center">
              <img
                src={mangaItem.image}
                alt={mangaItem.title}
                className="w-48 h-auto rounded mb-4"
              />
            </div>
            <h2 className="text-xl font-bold mb-2">{mangaItem.title}</h2>
          </div>

        ))}
      </section>
      <div className="flex justify-center mt-8">
        {
          (currentPage > 1 ) && (
            <button
              onClick={previousPage}
              className={`px-4 py-2 rounded  text-black font-bold mr-2 ${currentPage === 1 ? 'bg-gray-200 ' : 'bg-gray-300 hover:bg-gray-400'}`}

            >
              Previous
            </button>
          )
        }

        <span className="px-4 py-2 text-black font-bold bg-gray-300 rounded mr-2">Page 
        
        {currentPage} Out of {TotalPages}</span>
        {(TotalPages>1 & currentPage<TotalPages ) && (
          <button onClick={nextPage} className="px-4 py-2 text-black font-bold bg-gray-300 rounded hover:bg-gray-400">
            Next
          </button>
        )}
      </div>

      </>
    )
}

export default Searchmanga