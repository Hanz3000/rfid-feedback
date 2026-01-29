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
    color: "from-red-400 to-red-600",
    
  },
  {
    slotId: 2,
    name: "Dilarang Putar Balik",
    iconImage: "/images/icon-putar.png",
    correctCardId: "CARD_PUTAR",
    videoSrc: "/videos/rambu-benar2.mp4",
    color: "from-orange-400 to-orange-600",
    
  },
  {
    slotId: 3,
    name: "Rambu Penyebrangan",
    iconImage: "/images/icon-penyebrangan.png",
    correctCardId: "CARD_penyebrangan",
    videoSrc: "/videos/rambu-benar3.mp4",
    color: "from-blue-400 to-blue-600",
    
  }
];

// Audio Assets
const AUDIO_CORRECT = "/sounds/correct-ding.mp3";
const AUDIO_WRONG = "/sounds/error.mp3";
const AUDIO_CELEBRATION = "/sounds/success.m4a";
const AUDIO_START = "/sounds/start-game.mp3";

type SlotStatus = 'idle' | 'correct' | 'wrong';

// Komponen Confetti Particle
const ConfettiPiece = ({ delay }: { delay: number }) => (
  <div
    className="fixed pointer-events-none animate-confetti"
    style={{
      left: Math.random() * 100 + '%',
      top: -10,
      animationDelay: delay + 'ms',
      fontSize: ['🎉', '⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)],
    }}
  >
    {['🎉', '⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
  </div>
);

// Komponen Sparkle
const Sparkle = ({ delay }: { delay: number }) => (
  <div
    className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-sparkle"
    style={{
      animationDelay: delay + 'ms',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
    }}
  />
);

export default function GamePage() {
  // --- STATE MANAGEMENT ---
  const [gameState, setGameState] = useState<'playing' | 'celebration' | 'reward_sequence' | 'finished'>('playing');
  const [slotsStatus, setSlotsStatus] = useState<Record<number, SlotStatus>>({
    1: 'idle', 2: 'idle', 3: 'idle'
  });
  const [feedbackSlot, setFeedbackSlot] = useState<{id: number, type: 'correct' | 'wrong'} | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<number[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    playAudio(AUDIO_START);
  }, []);

  // --- LOGIKA ANIMASI FEEDBACK ---
  useEffect(() => {
    if (feedbackSlot) {
      const timer = setTimeout(() => {
        setFeedbackSlot(null);
      }, 3000);
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
        playAudio(AUDIO_CORRECT);
        setSlotsStatus(prev => ({ ...prev, [slotId]: 'correct' }));
        setFeedbackSlot({ id: slotId, type: 'correct' });
      } else {
        playAudio(AUDIO_WRONG);
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
    <main className="relative w-full min-h-screen overflow-hidden font-sans selection:bg-none bg-gradient-to-b from-sky-300 via-sky-200 to-green-100">
      {/* === BACKGROUND PARALLAX === */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Matahari */}
        <div className="absolute top-8 right-12 text-9xl animate-float opacity-90">☀️</div>

        {/* Awan bergerak paralax */}
        <div className="absolute top-12 left-10 text-7xl animate-drift opacity-70">☁️</div>
        <div className="absolute top-32 right-20 text-6xl animate-drift-slow opacity-60">☁️</div>
        <div className="absolute top-20 left-1/3 text-5xl animate-drift opacity-50">☁️</div>

        {/* Rumput / Bukit */}
        <div className="absolute bottom-0 w-full h-40">
          <svg className="w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#16a34a', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              d="M 0,100 Q 300,40 600,100 T 1200,100 L 1200,200 L 0,200 Z"
              fill="url(#grassGradient)"
            />
            <path
              d="M 0,120 Q 200,80 400,120 T 800,120 T 1200,120 L 1200,200 L 0,200 Z"
              fill="#15803d"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Jalan raya */}
        <div className="absolute bottom-12 w-full h-16 bg-gradient-to-b from-gray-600 to-gray-800 flex items-center justify-center">
          <div className="w-full flex gap-8 px-4">
            <div className="h-1 flex-1 bg-yellow-300 rounded-full"></div>
            <div className="h-1 flex-1 bg-yellow-300 rounded-full"></div>
            <div className="h-1 flex-1 bg-yellow-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* === AUDIO REF === */}
      <audio ref={audioRef} className="hidden" />

      {/* === CONFETTI === */}
      {confettiPieces.map((i) => (
        <ConfettiPiece key={i} delay={i * 50} />
      ))}

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-4 pt-6 md:pt-8">
        {/* --- STATE: PLAYING --- */}
        {gameState === 'playing' && (
          <div className="w-full max-w-7xl animate-fade-in flex flex-col items-center">
            {/* HOME BUTTON */}
            <Link
              href="/"
              className="absolute top-6 left-6 bg-white hover:bg-yellow-50 text-blue-600 p-4 rounded-full shadow-lg font-bold text-2xl transition-all hover:scale-110 hover:shadow-xl border-4 border-blue-300 z-50"
            >
              🏠
            </Link>

            {/* HEADER DENGAN IKON */}
            <div className="text-center mb-8 relative animate-slide-down">
              <div className="inline-block relative">
                <div className="absolute -left-12 -top-8 text-5xl animate-bounce" style={{ animationDelay: '0s' }}>🎯</div>
                <div className="absolute -right-12 -top-8 text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🚦</div>

               <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-8 drop-shadow-lg stroke-black bg-orange-500/80 px-8 py-3 rounded-full border-4 border-white">
              COCOKKAN GAMBAR DENGAN KARTUMU!
            </h2>
              </div>
            </div>

            {/* GRID 3 KOLOM */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
              {LEVEL_DATA.map((item) => {
                const status = slotsStatus[item.slotId];
                const isFeedback = feedbackSlot?.id === item.slotId;
                const feedbackType = feedbackSlot?.type;

                return (
                  <div
                    key={item.slotId}
                    className={`relative bg-white rounded-[50px] p-6 flex flex-col items-center transition-all duration-300 transform
                      ${status === 'correct' ? 'border-b-8 border-green-500 ring-4 ring-green-300 scale-105 z-10 shadow-2xl' : ''}
                      ${status === 'wrong' ? 'border-b-8 border-red-400 ring-4 ring-red-200 shadow-xl' : ''}
                      ${status === 'idle' ? 'border-b-8 border-blue-200 shadow-2xl hover:shadow-3xl hover:scale-102 cursor-pointer' : ''}
                    `}
                  >
                    {/* SLOT BADGE */}
                    <div
                      className={`absolute -top-6 px-8 py-3 rounded-full text-white font-black text-2xl shadow-lg border-4 border-white transition-all duration-300 bg-gradient-to-r ${item.color}`}
                    >
                      SLOT {item.slotId}
                    </div>

                    {/* CARD IMAGE AREA */}
                    <div
                      className={`w-full aspect-square rounded-[35px] mb-4 mt-6 flex items-center justify-center overflow-hidden border-4 relative group transition-all duration-300
                        ${status === 'correct' ? 'bg-green-50 border-green-400 border-solid shadow-lg' : ''}
                        ${status === 'wrong' ? 'bg-red-50 border-red-300 border-solid shadow-md' : ''}
                        ${status === 'idle' ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 border-dashed shadow-lg hover:shadow-2xl hover:border-solid' : ''}
                      `}
                    >
                      {/* FEEDBACK ANIMATION */}
                      {isFeedback ? (
                        feedbackType === 'correct' ? (
                          <div className="flex flex-col items-center justify-center animate-zoom-in relative w-full h-full">
                            {/* Sparkles */}
                            {[...Array(6)].map((_, i) => (
                              <Sparkle key={i} delay={i * 100} />
                            ))}
                            <span className="text-9xl drop-shadow-lg">✅</span>
                            <span className="text-green-600 font-black text-4xl mt-3 drop-shadow-md">BENAR!</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center animate-shake-soft w-full h-full">
                            <span className="text-8xl">❌</span>
                            <span className="text-red-600 font-black text-3xl mt-2 drop-shadow-md">SALAH!</span>
                            <p className="text-red-500 font-bold text-base mt-2 bg-white/80 px-4 py-2 rounded-full">Coba Lagi Ya 😊</p>
                          </div>
                        )
                      ) : (
                        <div className="text-center flex flex-col items-center justify-center h-full w-full p-4 animate-fade-in relative">
                          <img
                            src={item.iconImage}
                            alt={item.name}
                            className="w-4/5 h-4/5 object-contain drop-shadow-md"
                          />
                          {status === 'idle' && (
                            <div className="absolute bottom-4 bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md animate-pulse border-2 border-white">
                            Tempel Kartu Di Papan
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* NAMA RAMBU */}
                    <h3 className="text-xl md:text-2xl font-black text-gray-800 text-center leading-tight min-h-[3.5rem] flex items-center justify-center">
                      {item.name}
                    </h3>

                    {/* STATUS BADGE */}
                    <div
                      className={`mt-4 w-full py-3 rounded-2xl text-center font-black text-white text-lg transition-all duration-300 shadow-lg border-2 border-white
                        ${status === 'correct' ? 'bg-gradient-to-r from-green-400 to-emerald-500 scale-110' : ''}
                        ${status === 'wrong' ? 'bg-red-400' : ''}
                        ${status === 'idle' ? 'bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse' : ''}
                      `}
                    >
                      {status === 'correct' && "TERISI BENAR"}
                      {status === 'wrong' && "❌ KARTU SALAH"}
                      {status === 'idle' && "⏳ MENUNGGU..."}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        
        {/* --- CELEBRATION (HEBAT!) --- */}
        {gameState === 'celebration' && (
            <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 'animate-fade-out' : 'animate-zoom-in'}`}>
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
  <div className="fixed inset-0 z-50 bg-gradient-to-b from-sky-400 to-blue-200 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">

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
          <div className="fixed inset-0 z-50 bg-gradient-to-b from-purple-400 via-pink-300 to-purple-200 flex flex-col items-center justify-center p-4 animate-zoom-in">
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-4xl animate-float"
                  style={{
                    left: Math.random() * 90 + 5 + '%',
                    top: Math.random() * 80 + 10 + '%',
                    animationDelay: i * 300 + 'ms',
                    opacity: 0.8,
                  }}
                >
                  {'⭐🎉🌟✨💫'[i % 5]}
                </div>
              ))}
            </div>

            <div className="relative z-10 bg-gradient-to-br from-yellow-300 via-orange-300 to-yellow-400 p-12 rounded-[50px] text-center border-8 border-white shadow-2xl max-w-2xl w-full">
              <div className="text-9xl mb-6 animate-bounce">🏆</div>
              <h1 className="text-6xl md:text-7xl font-black text-white drop-shadow-lg mb-6">LUAR BIASA!</h1>
              <p className="text-2xl text-white font-bold mb-10 drop-shadow-md">Kamu Sudah Menyelesaikan Semua Tantangan!</p>

              <Link href="/">
                <button className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white text-3xl font-black py-5 px-16 rounded-full shadow-xl transform hover:scale-110 transition-all border-4 border-white">
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
          className="fixed bottom-8 right-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white w-20 h-20 rounded-full font-bold shadow-2xl border-4 border-white z-50 hover:scale-125 transition-transform flex items-center justify-center text-4xl hover:shadow-3xl animate-pulse"
        >
          🛠️
        </button>
      )}

      {/* === MODAL SIMULASI === */}
      {showModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative border-4 border-blue-300">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 font-bold text-2xl hover:scale-110 w-12 h-12 rounded-full transition-all border-2 border-white"
            >
              ✕
            </button>

            {/* TITLE */}
            <h3 className="font-black text-2xl mb-6 text-center border-b-4 border-blue-400 pb-3 text-blue-900">
              Simulasi Sensor RFID
            </h3>

            {/* BUTTONS */}
            <div className="space-y-4">
              {LEVEL_DATA.map((item) => (
                <div
                  key={item.slotId}
                  className="flex items-center gap-3 p-4 border-4 border-blue-300 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all"
                >
                  <div className="font-black text-lg text-blue-900 min-w-fit bg-blue-100 px-4 py-2 rounded-full border-2 border-blue-300">
                    Slot {item.slotId}
                  </div>

                  <button
                    onClick={() => handleRFIDScan(item.slotId, item.correctCardId)}
                    disabled={slotsStatus[item.slotId] === 'correct'}
                    className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white py-3 rounded-xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                  >
                    Benar
                  </button>

                  <button
                    onClick={() => handleRFIDScan(item.slotId, "WRONG_CARD")}
                    disabled={slotsStatus[item.slotId] === 'correct'}
                    className="bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white px-4 py-3 rounded-xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                  >
                    Salah
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === CUSTOM STYLES === */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoom-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes shake-soft {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-8px);
          }
          75% {
            transform: translateX(8px);
          }
        }

        @keyframes confetti {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes drift {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(30px);
          }
        }

        @keyframes drift-slow {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(20px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-confetti {
          animation: confetti 3s linear forwards;
        }

        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }

        .animate-drift {
          animation: drift 6s ease-in-out infinite;
        }

        .animate-drift-slow {
          animation: drift-slow 8s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-shake-soft {
          animation: shake-soft 0.4s ease-in-out;
        }

        .animate-zoom-in {
          animation: zoom-in 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .stroke-text {
          text-shadow:
            -2px -2px 0 #1e3a8a,
            2px -2px 0 #1e3a8a,
            -2px 2px 0 #1e3a8a,
            2px 2px 0 #1e3a8a,
            -3px 0 0 #1e3a8a,
            3px 0 0 #1e3a8a,
            0 -3px 0 #1e3a8a,
            0 3px 0 #1e3a8a;
        }

        .scale-102 {
          transform: scale(1.02);
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </main>
  );
}