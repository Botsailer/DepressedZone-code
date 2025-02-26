import React from 'react'

function Loadingc() {
  return (
    <div className="flex justify-center items-center h-screen">
    <div>
      <img src="/loading.gif" alt="Loading" />
      <br />
      <h1 className="text-2xl font-bold">Loading...</h1>
    </div>
  </div>
  )
}

export default Loadingc