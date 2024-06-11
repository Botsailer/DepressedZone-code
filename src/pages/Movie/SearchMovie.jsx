import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../helper/axios'
import Loadingc from '../../Components/Loading';

function SearchMovie() {
    const id = useParams()
    const [Loading, setLoading] = useState(false);
    const [Results , setResults] = useState([])
    const navigate = useNavigate()




    useEffect(() => {
        if (!id || id === undefined || id === '') {
            return;
        }

        console.log(id);
        const fetchData = async () => {
            try {
                setLoading(true);
                const searchResponse = await axios.get(`/movies/flixhq/${id.id}`);
                console.log(searchResponse.data);
                setResults(searchResponse.data.results);
            } catch (error) {
                console.error('Error searching data', error);
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);
  


    if (!id || id === undefined || id === '') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
                <h1 className="text-6xl font-bold">404</h1>
                <h2 className="text-4xl">Oops! Page not found.</h2>
                <p className="mt-4 text-xl">We can't find the page you're looking for.</p>
                <p className="mt-4 text-xl">But don't worry, Here's solution put query in url.</p>
                <img className="w-64 h-64 mt-8" src="https://i.imgur.com/qIufhof.png" alt="Cute cat stating: I have no idea what I'm doing" />
            </div>
        );
    }

    if (Loading) {
        return <Loadingc />;
    }

  return (
    <>
        


{ Results.length > 0 ? 
    <div className="flex flex-wrap justify-center">
      {Results.map(item => (
        <div onClick={()=>{
            navigate(`/movie/info?Id=${item.id}`)
        }} key={item.id} className="m-4 w-64">
          <img src={item.image} alt={item.title} className="w-full h-96 object-cover rounded-md shadow-lg" />
          <div className="mt-2">
          <h1 className="text-xl font-bold">{item.title}</h1>
            <p className="text-xl text-black">Year: {item.releaseDate}</p>
            <p className="text-xl text-black">Type : {item.type}</p>
          </div>
        </div>
      ))}
    </div>:
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
    <h1 className="text-6xl font-bold">No contents Found maybe not exists </h1>
    
</div>
    
    }
    
    </>
  )
}

export default SearchMovie