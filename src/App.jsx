import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Anime components
import Homepage from './pages/Anime/homepage';
import Searchquery from './pages/Anime/searchquery';
import AnimeList from './pages/Anime/animelist';
import AnimeArtList from './pages/Anime/AnimeArtList';
import Episodes from './pages/Anime/Episodes';
import Searchgeners from './pages/Anime/AnimeGenre';

// Manga components
import MangaPage from './pages/Manga/Mangahome';
import Searchmanga from './pages/Manga/Searchmanga';
import Mangainfo from './pages/Manga/Mangainfo';
import RenderChapters from './pages/Manga/RenderChapters';
import ReadManga from './pages/Manga/ReadManga';
import GenrePage from './pages/Manga/GenerPage';

// K-Drama components
import KDRAMAHOME from './pages/KDRAMA/KDRAMAHOME';
import KDRAMAINFO from './pages/KDRAMA/KDRAMAINFO';
import KDRAMAEPISODES from './pages/KDRAMA/KDRAMAEPISODES';

// Movie components
import MovieHome from './pages/Movie/MovieHome';
import SearchMovie from './pages/Movie/SearchMovie';
import MovieInfo from './pages/Movie/MovieInfo';
import WatchMovie from './pages/Movie/WatchMovie';

// UI components
import Navbar from './Components/navbar';
import Footer from './Components/Footer';
import DMCA from './Components/DMCA';
import Error404 from './pages/Error404';

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5 minutes
      retry: 1,
    },
  },
});

// ScrollToTop component for handling scroll position on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Dynamic Title component to handle title and meta tags
function DynamicHead({ title, description }) {
  return (
    <Helmet>
      <title>{title ? `${title} | Depressed Zone` : 'Depressed Zone - Ad-Free Anime & Manga'}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage and system preference for dark mode
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? JSON.parse(savedMode) : 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Update localStorage when darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <div className={`App ${darkMode ? 'dark' : ''}`}>
          <DynamicHead 
            title="Ad-Free Anime, Manga & K-Drama" 
            description="Explore ad-free anime, manga, K-dramas, and movies with no signup required. Your ultimate entertainment platform."
          />
          
          <BrowserRouter>
            <ScrollToTop />
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            
            <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
              <Routes>
                {/* Home Route */}
                <Route 
                  index 
                  path="/" 
                  element={
                    <>
                      <DynamicHead 
                        title="Home - Ad-Free Anime & Manga" 
                        description="Your ad-free platform for anime, manga, and K-dramas with zero signup requirements."
                      />
                      <Homepage />
                    </>
                  } 
                />
                
                {/* Anime Section */}
                <Route 
                  path="/search/:anime?" 
                  element={
                    <>
                      <DynamicHead 
                        title="Search Anime" 
                        description="Search your favorite anime series and movies in our extensive library."
                      />
                      <Searchquery />
                    </>
                  } 
                />
                <Route 
                  path="/anime/artwork" 
                  element={
                    <>
                      <DynamicHead 
                        title="Anime Artwork Gallery" 
                        description="Browse beautiful artwork from your favorite anime series."
                      />
                      <AnimeArtList />
                    </>
                  } 
                />
                <Route 
                  path="/anime/:id" 
                  element={<AnimeList />} 
                />
                <Route 
                  path="/anime/genres/:geners" 
                  element={
                    <>
                      <DynamicHead 
                        title="Anime by Genre" 
                        description="Discover anime series filtered by your favorite genres."
                      />
                      <Searchgeners />
                    </>
                  } 
                />
                <Route 
                  path="/episodes" 
                  element={<Episodes />} 
                />
                
                {/* Manga section */}
                <Route 
                  path="/manga/chapters" 
                  element={<RenderChapters />} 
                />
                <Route 
                  path="/manga/read" 
                  element={<ReadManga />} 
                />
                <Route 
                  path="/searchmanga/:manga?" 
                  element={
                    <>
                      <DynamicHead 
                        title="Search Manga" 
                        description="Find your favorite manga series in our comprehensive collection."
                      />
                      <Searchmanga />
                    </>
                  } 
                />
                <Route 
                  path="/mangainfo/:manga?" 
                  element={<Mangainfo />} 
                />
                <Route 
                  path="/genre/:genreId" 
                  element={
                    <>
                      <DynamicHead 
                        title="Manga by Genre" 
                        description="Browse manga titles by your preferred genres."
                      />
                      <GenrePage />
                    </>
                  } 
                />
                <Route 
                  path="/Manga" 
                  element={
                    <>
                      <DynamicHead 
                        title="Manga Library" 
                        description="Explore our extensive collection of manga titles available to read for free."
                      />
                      <MangaPage />
                    </>
                  } 
                />

                {/* K-Drama Section */}
                <Route 
                  path="/Kdrama" 
                  element={
                    <>
                      <DynamicHead 
                        title="K-Drama Collection" 
                        description="Stream popular Korean dramas with no ads or signup requirements."
                      />
                      <KDRAMAHOME />
                    </>
                  } 
                />
                <Route 
                  path="/Kdramainfo" 
                  element={<KDRAMAINFO />} 
                />
                <Route 
                  path="/Kdramawatch" 
                  element={<KDRAMAEPISODES />} 
                />

                {/* Movie Section */}
                <Route 
                  path="/movie" 
                  element={
                    <>
                      <DynamicHead 
                        title="Movie Collection" 
                        description="Watch anime movies and films without interruptions or ads."
                      />
                      <MovieHome />
                    </>
                  } 
                /> 
                <Route 
                  path='/movie/search/:id' 
                  element={<SearchMovie />} 
                />
                <Route 
                  path='/movie/info' 
                  element={<MovieInfo />} 
                />
                <Route 
                  path='/movie/watch' 
                  element={<WatchMovie />} 
                />
                
                {/* Legal Pages */}
                <Route 
                  path="/dmca" 
                  element={
                    <>
                      <DynamicHead 
                        title="DMCA Policy" 
                        description="Our DMCA policy and copyright information for content on Depressed Zone."
                      />
                      <DMCA />
                    </>
                  } 
                />

                {/* Error Page */}
                <Route 
                  path="*" 
                  element={
                    <>
                      <DynamicHead 
                        title="Page Not Found" 
                        description="The page you're looking for doesn't exist. Navigate back to our homepage."
                      />
                      <Error404 />
                    </>
                  } 
                />
              </Routes>
            </main>
            
            <Footer />
          </BrowserRouter>
        </div>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;