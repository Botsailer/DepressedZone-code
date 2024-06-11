import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../helper/axios';
import Loadingc from '../../Components/Loading';

function Mangainfo() {
  const { manga } = useParams();
  const [MangaData, setMangaData] = useState(null);
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://manga-api-vercel.vercel.app/api/manga/${manga}`);
        console.log(response.data);
        setMangaData(response.data);
      } catch (error) {
        console.log("error in data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [manga]);


return (
  Loading ? <Loadingc/>: (
    <div className="container mx-auto px-4 py-8">
      {MangaData ? (
        <div>
          <h1 className="text-3xl font-bold mb-4 text-center">{MangaData.name}</h1>
          <div className="grid md:grid-cols-3 gap-4 items-start">
            <div className="col-span-3 md:col-span-1">
              <img src={MangaData.imageUrl} alt={MangaData.title} className="w-full h-auto rounded shadow" />
            </div>
            <div className="col-span-3 md:col-span-2">
              <p className="text-lg mb-4" dangerouslySetInnerHTML={{ __html: MangaData.description }}></p>
              <div className="mb-2">
                <span className="font-bold">Chapters:</span> {MangaData.chapterList.length > 0 ? MangaData.chapterList.length : 'N/A'}
              </div>
        
              <div className="mb-2">
                <span className="font-bold">Genres:</span> {MangaData.genres.join(', ')}
              </div>
              <div className="mb-2">
                <span className="font-bold">Status:</span> {MangaData.status}</div>
              <div className="mb-2">
                <span className="font-bold">Author:</span> {MangaData.author}</div>
              <div className="mb-2">
                <span className="font-bold">Last Updated:</span> {MangaData.updated}</div>
              <div className="mb-2">
                <span className="font-bold">view:</span> {MangaData.view}</div>
             

              <div className=' mt-5 p-5'>
            <input onClick={()=>{
              navigate(`/manga/chapters`, {state: MangaData.chapterList})
            }} type="button" value="Read Now" className="mt-2 md:mt-0 md:ml-2 px-2 py-1 scale-105 rounded bg-purple-500 text-white cursor-pointer" />
          </div>
            </div>
      
          </div>          
        </div>
      ) : (
        <Loadingc/>
      )}
    </div>
  ));
}

export default Mangainfo;