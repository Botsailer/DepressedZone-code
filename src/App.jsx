import { useState } from 'react';
import './App.css';
import Homepage from './pages/Anime/homepage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Searchquery from './pages/Anime/searchquery';
import Error404 from './pages/Error404';
import AnimeList from './pages/Anime/animelist';
import AnimeArtList from './pages/Anime/AnimeArtList';
import MangaPage from './pages/Manga/Mangahome';
import Searchmanga from './pages/Manga/Searchmanga';
import Mangainfo from './pages/Manga/Mangainfo';
import RenderChapters from './pages/Manga/RenderChapters';
import ReadManga from './pages/Manga/ReadManga';
import Navbar from './Components/navbar';
import Episodes from './pages/Anime/Episodes';
import MovieHome from './pages/Movie/MovieHome';
import SearchMovie from './pages/Movie/SearchMovie';
import MovieInfo from './pages/Movie/MovieInfo';
import WatchMovie from './pages/Movie/WatchMovie';
import Searchgeners from './pages/Anime/AnimeGenre';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <BrowserRouter>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
          <Routes>
            <Route index path="/" element={<Homepage />} />
            
            {/* Anime Section */}
            <Route path="/search/:anime?" element={<Searchquery />} />
            <Route path="/anime/artwork" element={<AnimeArtList />} />
            <Route path="/anime/:id?" element={<AnimeList />} />
            <Route path="/anime/genres/:geners" element={<Searchgeners />} />
            <Route path="/episodes" element={<Episodes />} />
            {/* Manga section */}
            <Route path="/manga/chapters" element={<RenderChapters />} />
            <Route path="/manga/read" element={<ReadManga />} />
            <Route path="/searchmanga/:manga?" element={<Searchmanga />} />
            <Route path="/mangainfo/:manga?" element={<Mangainfo />} />
            <Route path="/Manga" element={<MangaPage />} />

          {/* Movie */}
           <Route path="/movie" element={<MovieHome />} /> 
           <Route path='/movie/search/:id?' element={<SearchMovie />} />
           <Route path='/movie/info' element={<MovieInfo />} />
           <Route path='/movie/watch/:id' element={<WatchMovie />} />
           


            {/* Error Page */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;