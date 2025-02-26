import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function AnimeArtList() {
  const location = useLocation();
  const artwork = location.state?.data;
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const imagesPerPage = 50;

  if (!artwork || artwork.length === 0) {
    return <div className="text-center text-2xl mt-8">No artwork available.</div>;
  }

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const startIndex = (page - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const visibleArtwork = artwork.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Artwork</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleArtwork.map((art, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={art.img}
              alt={`Artwork ${index + 1}`}
              className="w-full h-auto mb-2 cursor-pointer"
              onClick={() => handleImageClick(art.img)}
            />
          </div>
        ))}
      </div>
      {endIndex < artwork.length && (
        <div className="text-center mt-8">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        </div>
      )}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
          <div className="max-w-full max-h-full">
            <img src={selectedImage} alt="Selected Artwork" className="max-w-full max-h-full" />
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={handleCloseModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnimeArtList;