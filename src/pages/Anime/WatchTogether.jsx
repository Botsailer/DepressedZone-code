// import React, { useEffect, useState, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from '../../helper/axios';
// import Hls from 'hls.js';
// import io from 'socket.io-client';

// const socket = io('http://localhost:4000');

// function WatchTogether() {
//   const { roomid } = useParams();
//   const navigate = useNavigate();
//   const [episodes, setEpisodes] = useState([]);
//   const [currentEpisode, setCurrentEpisode] = useState(null);
//   const [qualities, setQualities] = useState([]);
//   const [SelectedQuality, setSelectedQuality] = useState('');
//   const videoRef = useRef(null);
//   const hlsRef = useRef(null);
//   const [preplay, setPreplay] = useState('');
//   const [participantCount, setParticipantCount] = useState(0);

//   useEffect(() => {
//     const preplayId = new URLSearchParams(window.location.search).get('preplay');
//     if (preplayId) {
//       setPreplay(preplayId);
//       fetchPreplayData(preplayId);
//     }
//   }, []);

//   useEffect(() => {
//     socket.on('updateParticipantCount', (count) => {
//       setParticipantCount(count);
//     });

//     socket.emit('joinRoom', roomid);

//     return () => {
//       socket.emit('leaveRoom', roomid);
//     };
//   }, [roomid]);

//   const fetchPreplayData = async (preplayId) => {
//     let Url = `/anime/gogoanime/watch/${preplayId}`;
//     const response = await axios.get(Url, { params: { server: "gogocdn" } });
//     const sources = response.data.sources;
//     setEpisodes([response.data.episode]);
//     if (sources && sources.length > 0) {
//       const defaultSource = sources.find(source => source.quality === 'default') || sources[0];
//       setQualities(sources);
//       setSelectedQuality(defaultSource.quality);
//       setupHls(defaultSource.url);
//     }
//   };

//   useEffect(() => {
//     socket.on('updateVideoState', (data) => {
//       if (data.room === roomid) {
//         if (data.action === 'play') {
//           videoRef.current.play();
//         } else if (data.action === 'pause') {
//           videoRef.current.pause();
//         } else if (data.action === 'seek') {
//           videoRef.current.currentTime = data.time;
//         }
//       }
//     });

//     return () => {
//       socket.emit('leaveRoom', roomid);
//     };
//   }, [roomid]);

//   const setupHls = (url) => {
//     // ... (same as before)
//   };

//   const handlePlay = () => {
//     socket.emit('videoState', { room: roomid, action: 'play' });
//   };

//   const handlePause = () => {
//     socket.emit('videoState', { room: roomid, action: 'pause' });
//   };

//   const handleSeek = (time) => {
//     socket.emit('videoState', { room: roomid, action: 'seek', time });
//   };

//   const handleEpisodeClick = (episode) => {
//     setCurrentEpisode(episode);
//   };

//   const handleQualityChange = (quality) => {
//     const selectedQualitys = qualities.find(q => q.quality === quality);
//     setSelectedQuality(quality);
//     if (selectedQualitys) {
//       setupHls(selectedQualitys.url);
//     }
//   };

//   const handlePreviousEpisode = () => {
//     const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
//     if (currentIndex > 0) {
//       setCurrentEpisode(episodes[currentIndex - 1]);
//     }
//   };

//   const handleNextEpisode = () => {
//     const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
//     if (currentIndex < episodes.length - 1) {
//       setCurrentEpisode(episodes[currentIndex + 1]);
//     }
//   };

//   const createWatchTogether = () => {
//     const roomId = uuidv4().slice(0, 6);
//     const url = `/room/${roomId}`;
//     if (preplay) {
//       navigate(`${url}?preplay=${preplay}`);
//     } else {
//       navigate(url);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-900">
//       <div className="h-1/2 overflow-y-auto bg-gray-800 text-white p-4">
//         <h1 className="text-2xl font-bold mb-4">Episodes</h1>
//         <div className="flex flex-col space-y-2">
//           {episodes.length > 1 &&
//             episodes.map((episode, index) => (
//               <div
//                 key={index}
//                 className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer"
//                 onClick={() => handleEpisodeClick(episode)}
//               >
//                 <p className="text-lg font-semibold">Episode {episode.number}</p>
//                 <p className="text-sm text-gray-300">{episode.title}</p>
//               </div>
//             ))
//           }
//         </div>
//         <button onClick={createWatchTogether} className="mt-4 p-2 bg-blue-600 rounded hover:bg-blue-500">Watch Together</button>
//         <p className="mt-2">Participants: {participantCount}</p>
//       </div>
//       <div className="h-1/2 flex flex-col items-center justify-center">
//         {qualities.length > 0 ? (
//           <>
//             <div className="relative w-full h-0" style={{ paddingBottom: '56.25%' }}>
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 controls
//                 width="100%"
//                 height="100%"
//                 className="absolute top-0 left-0 w-full h-full rounded-md shadow-lg"
//                 onPlay={handlePlay}
//                 onPause={handlePause}
//                 onSeeked={() => handleSeek(videoRef.current.currentTime)}
//               />
//               <div className="absolute top-0 right-0 p-2 flex space-x-2 bg-gray-800 bg-opacity-75 rounded-bl-md">
//                 {qualities.filter(q => q.quality !== 'default' && q.quality !== 'backup').map((quality, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleQualityChange(quality.quality)}
//                     className={`bg-gray-700 text-white py-1 px-2 rounded text-sm ${SelectedQuality === quality.quality ? 'ring-2 ring-white' : ''}`}
//                   >
//                     {quality.quality}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="flex justify-between w-full mt-4 px-4">
//               {currentEpisode !== episodes[0] &&
//                 <button onClick={handlePreviousEpisode} disabled={currentEpisode === episodes[0]} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-500">
//                   Previous
//                 </button>
//               }
//               {
//                 currentEpisode !== episodes[episodes.length - 1] && (
//                   <button onClick={handleNextEpisode} disabled={currentEpisode === episodes[episodes.length - 1]} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-500">
//                     Next
//                   </button>
//                 )
//               }
//             </div>
//           </>
//         ) : (
//           <Loadingc />
//         )}
//       </div>
//     </div>
//   );
// }

// export default WatchTogether;
