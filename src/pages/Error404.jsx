import React from 'react';

function Error404() {
  const goBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden">
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-[-1]">
        <source src="1.webm" type="video/webm" />
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[-1]"></div>
      <div className="container mx-auto h-full flex flex-col justify-center items-center text-white px-4">
      <h1 style={{ fontSize: '5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center', fontFamily: 'serif' }}>
  Error 404. Page Not Found.
</h1>
        <p className="text-2xl mb-8 text-center font-poppins">Head back to previous page?</p>
        <div className="flex justify-center">
          <button
            onClick={goBack}
            className="px-8 py-3 bg-[#f74a1e] text-[#0eff06] text-xl font-bold rounded-lg shadow-lg hover:shadow-[#0ef165] transition-shadow duration-300"
          >
            Head Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Error404;