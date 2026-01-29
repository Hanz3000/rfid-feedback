'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
const LEVEL_DATA = [
  {
    slotId: 1,
    name: "Dilarang Parkir",
    iconImage: "/images/icon-parkir.png",
    correctCardId: "CARD_PARKIR",
    videoSrc: "/videos/rambu-benar.mp4",
    color: "from-red-400 to-red-600"
  },
  {
    slotId: 2,
    name: "Dilarang Putar Balik",
    iconImage: "/images/icon-putar.png",
    correctCardId: "CARD_PUTAR",
    videoSrc: "/videos/rambu-benar2.mp4",
    color: "from-orange-400 to-orange-600"
  },
  {
    slotId: 3,
    name: "Rambu Penyebrangan",
    iconImage: "/images/icon-penyebrangan.png",
    correctCardId: "CARD_penyebrangan",
    videoSrc: "/videos/rambu-benar3.mp4",
    color: "from-blue-400 to-blue-600"
  }
];
// Audio Assets
const AUDIO_CORRECT = "/sounds/correct-ding.mp3";
const AUDIO_WRONG = "/sounds/error.mp3";
const AUDIO_CELEBRATION = "/sounds/success.m4a";
const AUDIO_START = "/sounds/start-game.mp3";
type SlotStatus = 'idle' | 'correct' | 'wrong';
export default function GamePage() {
  // --- STATE MANAGEMENT ---
  const [gameState, setGameState] = useState<'playing' | 'celebration' | 'reward_sequence' | 'finished'>('playing');
 
  const [slotsStatus, setSlotsStatus] = useState<Record<number, SlotStatus>>({
    1: 'idle', 2: 'idle', 3: 'idle'
  });
  
  const [feedbackSlot, setFeedbackSlot] = useState<{id: number, type: 'correct' | 'wrong'} | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
     playAudio(AUDIO_START);
  }, []);
  // --- LOGIKA ANIMASI FEEDBACK ---
  useEffect(() => {
    if (feedbackSlot) {
      const timer = setTimeout(() => {
        setFeedbackSlot(null); // Kembalikan ke tampilan gambar asli
      }, 3000); // Durasi animasi 3 detik
      return () => clearTimeout(timer);
    }
  }, [feedbackSlot]);
  // --- LOGIKA CEK KONDISI MENANG ---
  useEffect(() => {
    const allCorrect = LEVEL_DATA.every(item => slotsStatus[item.slotId] === 'correct');
   
    if (allCorrect && gameState === 'playing') {
      const timer = setTimeout(() => {
        playAudio(AUDIO_CELEBRATION);
        setGameState('celebration');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [slotsStatus, gameState]);
  // --- LOGIKA TRANSISI: DARI CELEBRATION KE VIDEO ---
  useEffect(() => {
    if (gameState === 'celebration') {
      const timer = setTimeout(() => {
        setGameState('reward_sequence');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);
  // --- LOGIKA SCAN RFID ---
  const handleRFIDScan = (slotId: number, scannedCardId: string) => {
    if (gameState !== 'playing') return;
   
    if (slotsStatus[slotId] === 'correct') return;
    const targetData = LEVEL_DATA.find(d => d.slotId === slotId);
   
    if (targetData) {
      if (scannedCardId === targetData.correctCardId) {
        // --- JIKA BENAR ---
        playAudio(AUDIO_CORRECT); // Bunyikan suara benar
        setSlotsStatus(prev => ({ ...prev, [slotId]: 'correct' })); 
        setFeedbackSlot({ id: slotId, type: 'correct' });
      } else {
        // --- JIKA SALAH ---
        playAudio(AUDIO_WRONG); // Bunyikan suara salah
        setSlotsStatus(prev => ({ ...prev, [slotId]: 'wrong' })); 
        setFeedbackSlot({ id: slotId, type: 'wrong' }); 
      }
    }
  };
  // --- LOGIKA VIDEO BERGANTIAN ---
  const handleVideoEnded = () => {
    if (currentVideoIndex < LEVEL_DATA.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } else {
      setGameState('finished');
    }
  };
  // Helper Audio
  const playAudio = (src: string) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio error:", e));
    }
  };
  useEffect(() => {
    if (gameState === 'reward_sequence' && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [currentVideoIndex, gameState]);
  return (
    <main className="relative w-full min-h-screen bg-gradient-to-b from-sky-400 to-blue-200 overflow-hidden font-sans selection:bg-none">
      
      <audio ref={audioRef} className="hidden" />
      
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-10 left-10 text-6xl animate-bounce">☁️</div>
         <div className="absolute top-20 right-20 text-6xl animate-bounce" style={{animationDelay: '1s'}}>☁️</div>
         <div className="absolute bottom-0 w-full h-32 bg-green-500 rounded-t-[50%] scale-110 border-t-8 border-green-600"></div>
         <div className="absolute top-5 right-5 text-8xl animate-spin-slow">☀️</div>
      </div>
      
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-4">
        {/* --- STATE: PLAYING --- */}
        {gameState === 'playing' && (
          <div className="w-full max-w-6xl animate-fade-in flex flex-col items-center">
            <Link href="/" className="absolute top-4 left-4 bg-white/50 hover:bg-white p-3 rounded-full shadow-lg font-bold text-blue-600 transition z-50">
               🏠 Menu Utama
            </Link>
            <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-8 drop-shadow-lg stroke-black bg-orange-500/80 px-8 py-3 rounded-full border-4 border-white">
              COCOKKAN GAMBAR DENGAN KARTUMU!
            </h2>
           
            {/* GRID 3 KOLOM */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {LEVEL_DATA.map((item) => {
                const status = slotsStatus[item.slotId];
                // Cek apakah slot ini sedang dalam mode feedback (animasi sementara)
                const isFeedback = feedbackSlot?.id === item.slotId;
                const feedbackType = feedbackSlot?.type;
                return (
                  <div
                    key={item.slotId}
                    className={`relative bg-white rounded-[40px] p-4 flex flex-col items-center transition-all duration-300 border-b-8
                      ${status === 'correct' ? 'border-green-500 ring-4 ring-green-300 scale-105 z-10' : ''}
                      ${status === 'wrong' ? 'border-red-500 ring-4 ring-red-300' : ''}
                      ${status === 'idle' ? 'border-gray-200 shadow-xl' : ''}
                    `}
                  >
                  <div className={`absolute -top-5 px-6 py-2 rounded-full text-white font-bold text-xl shadow-md bg-gradient-to-r ${item.color}`}>
                    SLOT {item.slotId}
                  </div>
                  
                  <div className={`w-full aspect-square rounded-3xl mb-4 mt-4 flex items-center justify-center overflow-hidden border-4 relative group transition-colors duration-300
                      ${status === 'correct' ? 'bg-green-100 border-green-400 border-solid' : ''}
                      ${status === 'wrong' ? 'bg-red-100 border-red-400 border-solid' : ''}
                      ${status === 'idle' ? 'bg-gray-50 border-gray-300 border-dashed' : ''}
                  `}>
                   
                    {isFeedback ? (
                        // --- TAMPILAN ANIMASI SEMENTARA ---
                        feedbackType === 'correct' ? (
                          <div className="flex flex-col items-center justify-center animate-zoom-in">
                             <span className="text-8xl">✅</span>
                             <span className="text-green-700 font-black text-2xl mt-2">BENAR!</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center animate-shake">
                             <span className="text-8xl">❌</span>
                             <span className="text-red-600 font-black text-2xl mt-2">SALAH!</span>
                             <p className="text-red-500 font-bold text-sm mt-1">Coba Lagi Ya...</p>
                          </div>
                        )
                      ) : (
                        <div className="text-center flex flex-col items-center justify-center h-full w-full p-4 animate-fade-in">
                          <img
                            src={item.iconImage}
                            alt={item.name}
                            className="w-full h-full object-contain mb-2 drop-shadow-md"
                          />
                          {status === 'idle' && (
                              <p className="text-gray-400 font-bold text-sm bg-white px-2 py-1 rounded-md shadow-sm absolute bottom-4">Tempel Kartu Disini</p>
                          )}
                        </div>
                      )}
                  </div>
                  <h3 className="text-xl font-black text-gray-700 text-center leading-tight min-h-[3.5rem] flex items-center justify-center">
                    {item.name}
                  </h3>
                  <div className={`mt-3 w-full py-2 rounded-xl text-center font-bold text-white transition-colors
                    ${status === 'correct' ? 'bg-green-500' : ''}
                    ${status === 'wrong' ? 'bg-red-500' : ''}
                    ${status === 'idle' ? 'bg-gray-400 animate-pulse' : ''}
                  `}>
                    {status === 'correct' && "TERISI BENAR"}
                    {status === 'wrong' && "KARTU SALAH"}
                    {status === 'idle' && "MENUNGGU..."}
                  </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* --- CELEBRATION (HEBAT!) --- */}
        {gameState === 'celebration' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center animate-zoom-in p-4">
                <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-blue-200">
                     <div className="absolute top-10 left-10 text-6xl animate-bounce">☁️</div>
                     <div className="absolute top-20 right-20 text-6xl animate-bounce" style={{animationDelay: '1s'}}>☁️</div>
                     <div className="absolute bottom-0 w-full h-32 bg-green-500 rounded-t-[50%] scale-110 border-t-8 border-green-600"></div>
                     <div className="absolute top-5 right-5 text-8xl animate-spin-slow">☀️</div>
                </div>
                <div className="relative z-10 bg-[#6aeba2] rounded-[40px] border-8 border-yellow-400 shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-8 flex flex-col items-center text-center max-w-2xl w-full">
                    <div className="relative w-full h-64 md:h-80 mb-4 flex items-center justify-center">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-contain"
                        >
                            <source src="/videos/fiks.mp4" type="video/mp4" />
                        </video>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black text-white drop-shadow-md animate-bounce mb-4 stroke-text">
                       HEBAT!
                    </h2>
                    <div className="bg-white/20 px-8 py-3 rounded-full">
                        <p className="text-2xl md:text-3xl font-bold text-green-800">
                           Semua Jawaban Benar!
                        </p>
                    </div>
                </div>
            </div>
        )}
      {/* --- (PENJELASAN VIDEO) --- */}
{gameState === 'reward_sequence' && (
  <div className="fixed inset-0 z-50 bg-gradient-to-b from-sky-400 to-blue-200 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in">

    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-10 left-10 text-6xl animate-bounce">☁️</div>
      <div className="absolute top-20 right-20 text-6xl animate-bounce" style={{animationDelay: '1s'}}>☁️</div>
      <div className="absolute bottom-0 w-full h-32 bg-green-500 rounded-t-[50%] scale-110 border-t-8 border-green-600"></div>
      <div className="absolute top-5 right-5 text-8xl animate-spin-slow">☀️</div>
    </div>

    {/* Konten utama */}
    <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 md:px-8 flex flex-col items-center">
      <div className="w-full text-center mb-3 sm:mb-4">
        <h2 className="inline-block bg-white/80 backdrop-blur-md px-8 py-3 sm:px-10 sm:py-4 rounded-full shadow-lg border-2 border-yellow-400/70">
          <span className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-900 drop-shadow-md">
            {LEVEL_DATA[currentVideoIndex].name}
          </span>
        </h2>
      </div>
      <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border-6 border-yellow-400/90 shadow-xl shadow-yellow-400/20">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onEnded={handleVideoEnded}
          src={LEVEL_DATA[currentVideoIndex].videoSrc}
          autoPlay
          playsInline
        />

        <div className="absolute top-3 right-3 sm:top-4 sm:right-5 bg-yellow-400/80 backdrop-blur-sm text-white font-bold px-4 py-1.5 rounded-full text-sm sm:text-base shadow-md">
          Video {currentVideoIndex + 1} dari 3
        </div>
      </div>
      <div className="text-center mt-6 sm:mt-8 md:mt-10 px-4 w-full">
        <p className="text-yellow-200 text-lg sm:text-xl md:text-2xl font-bold drop-shadow-md">
          Sedang memutar penjelasan...
        </p>
      </div>
    </div>
  </div>
)}
        {/* --- FINISHED --- */}
        {gameState === 'finished' && (
           <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4 animate-zoom-in">
           <div className="bg-white p-10 rounded-[50px] text-center border-8 border-purple-500 shadow-2xl max-w-2xl">
               <div className="text-8xl mb-4">🏆</div>
               <h1 className="text-5xl font-black text-purple-600 mb-6">LUAR BIASA!</h1>
               <p className="text-xl text-gray-600 font-bold mb-8">Kamu sudah menyelesaikan semua tantangan!</p>
               <Link href="/">
                  <button className="bg-green-500 hover:bg-green-600 text-white text-3xl font-black py-4 px-12 rounded-full shadow-lg transform hover:scale-105 transition">
                     MAIN LAGI
                  </button>
               </Link>
           </div>
         </div>
        )}
      </div>
      {/* === TOMBOL SIMULASI === */}
      {gameState === 'playing' && (
        <button
          onClick={() => setShowModal(!showModal)}
          className="fixed bottom-5 right-5 bg-purple-600 text-white w-14 h-14 rounded-full font-bold shadow-lg border-2 border-white z-50 hover:scale-110 transition-transform flex items-center justify-center text-2xl"
        >
        🛠️
        </button>
      )}
      {/* MODAL SIMULASI */}
      {showModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl relative">
        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-red-500 font-bold text-xl hover:bg-red-50 w-8 h-8 rounded-full">✕</button>
        <h3 className="font-bold text-xl mb-4 text-center border-b pb-2 text-black">Simulasi Hardware RFID</h3>
        
        <div className="space-y-4">
          {LEVEL_DATA.map((item) => (
            <div key={item.slotId} className="flex items-center gap-3 p-3 border rounded-xl bg-gray-50">
              <div className="font-bold w-16 text-sm text-black">Slot {item.slotId}</div>
            <button
              onClick={() => handleRFIDScan(item.slotId, item.correctCardId)}
              disabled={slotsStatus[item.slotId] === 'correct'}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
            Benar
            </button>
            <button
              onClick={() => handleRFIDScan(item.slotId, "WRONG_CARD")}
              disabled={slotsStatus[item.slotId] === 'correct'}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-sm disabled:opacity-30"
            >
            Salah
            </button>
          </div>
          ))}
        </div>
      </div>
    </div>
      )}
      <style jsx>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
      `}</style>
    </main>
  );
}