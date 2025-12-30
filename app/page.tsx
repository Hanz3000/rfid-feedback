'use client';

import { useState, useRef, useEffect } from 'react';

// --- KONFIGURASI SLOT / TOMBOL ---
const SLOTS = [
  {
    id: 1,
    name: "Dilarang Parkir", 
    icon: "🚫🅿️", 
    color: "bg-red-500",
    shadow: "shadow-red-500/50",
    clueAudio: "/sounds/clue-rambu.mp3",
    correctCardId: "CARD_RAMBU",
    videoSrc: "/videos/rambu-benar.mp4"
  },
  {
    id: 2,
    name: "Dilarang Putar Balik", 
    icon: "↩️",
    color: "bg-orange-500",
    shadow: "shadow-orange-500/50",
    clueAudio: "/sounds/clue-putar.mp3", 
    correctCardId: "CARD_PUTAR",
    videoSrc: "/videos/rambu-benar2.mp4" 
  }
];

// File suara "Hore/Benar" sebelum video
const SUCCESS_SOUND_URL = "/sounds/success.m4a"; 

export default function Home() {
  const [status, setStatus] = useState<'idle' | 'listening' | 'success_waiting' | 'success' | 'error'>('idle');
  
  const [activeSlot, setActiveSlot] = useState<typeof SLOTS[0]>(SLOTS[0]);
  const [showModal, setShowModal] = useState(false);

  // REFS
  const videoRef = useRef<HTMLVideoElement>(null);         
  const listeningVideoRef = useRef<HTMLVideoElement>(null); 
  const audioRef = useRef<HTMLAudioElement>(null);         

  // --- FUNGSI 1: GANTI SLOT & PUTAR CLUE ---
  const handleSlotPress = (slot: typeof SLOTS[0]) => {
    setActiveSlot(slot);
    setStatus('listening');
    playAudio(slot.clueAudio, 1.0);
  };

  // --- FUNGSI 2: CEK KARTU RFID ---
  const handleRFIDScan = (scannedCardId: string) => {
    if (status === 'success' || status === 'success_waiting') return;

    if (scannedCardId === activeSlot.correctCardId) {
      setStatus('success_waiting');
      playAudio(SUCCESS_SOUND_URL, 1.0);
    } else {
      setStatus('error');
      playAudio('/sounds/error.mp3', 1.25); 
    }
  };

  // --- HELPER AUDIO PLAYER ---
  const playAudio = (src: string, rate: number = 1.0) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.playbackRate = rate;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio error:", e));
    }
  };

  // --- EVENT HANDLER SAAT AUDIO SELESAI ---
  const handleAudioEnded = () => {
    if (status === 'success_waiting') {
        setStatus('success');
    } 
    else if (status === 'listening' || status === 'error') {
      setStatus('idle');
    }
  };

  // --- EVENT HANDLER SAAT VIDEO SELESAI ---
  const handleVideoEnded = () => {
    setStatus('idle');
  };

  // EFFECT 1: Auto play video SUKSES
  useEffect(() => {
    if (status === 'success' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [status]);

  // EFFECT 2: Mengatur kecepatan video MENDENGARKAN
  useEffect(() => {
    if (status === 'listening' && listeningVideoRef.current) {
      listeningVideoRef.current.playbackRate = 0.6; 
      listeningVideoRef.current.play();
    }
  }, [status]);

  return (
    <main className="relative w-full min-h-screen bg-gradient-to-br from-sky-300 via-blue-200 to-cyan-100 overflow-hidden font-sans">

      {/* ELEMENT AUDIO GLOBAL */}
      <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />

      {/* --- BACKGROUND DEKORATIF KARTUN --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Awan-awan Mengambang */}
        <div className="absolute top-[5%] left-[10%] w-32 h-16 bg-white/90 rounded-full shadow-lg animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-[5%] left-[12%] w-24 h-12 bg-white/80 rounded-full shadow-md"></div>

        <div className="absolute top-[15%] right-[15%] w-40 h-20 bg-white/90 rounded-full shadow-lg animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[15%] right-[18%] w-28 h-14 bg-white/80 rounded-full shadow-md"></div>

        <div className="absolute bottom-[20%] left-[5%] w-36 h-18 bg-white/85 rounded-full shadow-lg animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-[20%] left-[8%] w-24 h-12 bg-white/75 rounded-full shadow-md"></div>

        {/* Bintang-bintang Berkelap-kelip */}
        <div className="absolute top-[10%] left-[25%] text-3xl animate-twinkle" style={{ animationDelay: '0s' }}>⭐</div>
        <div className="absolute top-[30%] right-[20%] text-2xl animate-twinkle" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-[15%] right-[10%] text-3xl animate-twinkle" style={{ animationDelay: '2s' }}>🌟</div>
        <div className="absolute top-[50%] left-[8%] text-2xl animate-twinkle" style={{ animationDelay: '3s' }}>⭐</div>

        {/* Matahari Ceria */}
        <div className="absolute top-[8%] right-[8%] w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-2xl flex items-center justify-center text-4xl animate-spin-slow">
          ☀️
        </div>

        {/* Pelangi */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[300px] opacity-40">
          <div className="absolute bottom-0 w-full h-12 bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 rounded-t-full"></div>
          <div className="absolute bottom-3 w-full h-12 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-t-full"></div>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center z-20 p-4 md:p-8">
        
        {/* CENTER SCREEN DISPLAY */}
        <div className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-[50px] border-8 border-yellow-400 shadow-[0_20px_60px_rgba(0,0,0,0.2),0_0_0_4px_#FDE047,0_0_0_8px_#FB923C] relative flex items-center justify-center overflow-hidden group min-h-[450px] md:min-h-[550px]">

          {/* Border Inner Glow Effect */}
          <div className={`absolute inset-0 rounded-[42px] transition-all duration-500 pointer-events-none border-4 ${status === 'success' || status === 'success_waiting' ? 'border-green-400 shadow-[inset_0_0_30px_rgba(74,222,128,0.5)]' : 'border-pink-300 shadow-[inset_0_0_20px_rgba(249,168,212,0.3)]'}`}></div>

          {/* Dekorasi Sudut */}
          <div className="absolute top-4 left-4 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎈</div>
          <div className="absolute top-4 right-4 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎈</div>
          <div className="absolute bottom-4 left-4 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🌺</div>
          <div className="absolute bottom-4 right-4 text-3xl animate-bounce" style={{ animationDelay: '1.5s' }}>🌺</div>

          {/* --- TAMPILAN 1: IDLE --- */}
          {status === 'idle' && (
            <div className="text-center p-8 animate-fade-in-up z-10 w-full flex flex-col items-center">
              
              {/* VIDEO IDLE */}
              <div className="relative w-56 h-56 md:w-64 md:h-64 mb-6 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                >
                    <source src="/videos/idle-anim.mp4" type="video/mp4" />
                    Browser tidak mendukung video.
                </video>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-500 mb-4 drop-shadow-lg tracking-tight">
                Tempel Kartu Ajaibmu!
              </h1>
              <div className="relative inline-block mt-4">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <p className="relative text-base md:text-lg font-bold text-blue-800 bg-gradient-to-r from-cyan-100 to-blue-100 py-3 px-8 rounded-full border-4 border-blue-400 shadow-lg">
                  👉 Pencet tombol di samping untuk dengar petunjuk
                </p>
              </div>
            </div>
          )}

          {/* --- TAMPILAN 2: LISTENING (VIDEO MENDENGARKAN) --- */}
          {status === 'listening' && (
            <div className="flex flex-col items-center text-center p-8 animate-fade-in z-10 w-full">
              
              {/* VIDEO ANIMASI MENDENGARKAN */}
              <div className="relative w-56 h-56 md:w-64 md:h-64 mb-6 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-orange-300 ring-opacity-50">
                <video 
                    ref={listeningVideoRef} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover transform scale-105"
                >
                    <source src="/videos/mendengarkan.mp4" type="video/mp4" />
                    Browser tidak mendukung video.
                </video>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 tracking-tight mb-6 drop-shadow-lg animate-pulse">
                Dengarkan Suaranya...
              </h1>
              <div className="bg-gradient-to-r from-yellow-200 to-orange-200 px-8 py-3 rounded-2xl border-4 border-orange-400 shadow-lg">
                 <p className="text-orange-800 font-black text-lg">
                   🎵 Sedang memutar petunjuk: <span className="underline decoration-wavy">{activeSlot.name}</span>
                 </p>
              </div>
            </div>
          )}

          {/* --- TAMPILAN 3A: SUCCESS WAITING --- */}
          {status === 'success_waiting' && (
             <div className="absolute inset-0 z-50 bg-gradient-to-br from-green-300 to-emerald-200 rounded-[42px] flex flex-col items-center justify-center animate-zoom-in text-center p-4">
                 {/* <div className="text-[100px] md:text-[120px] mb-4 animate-bounce">🎉</div> */}
                 <h2 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]">HEBAT!</h2>
                 <p className="text-2xl md:text-3xl font-bold text-green-800 bg-white/60 px-8 py-3 rounded-full mt-4">
                    Jawabannya Benar!
                 </p>
             </div>
          )}

          {/* --- TAMPILAN 3B: SUCCESS VIDEO --- */}
          {status === 'success' && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-100 to-green-100 rounded-[42px] flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                onEnded={handleVideoEnded}
              >
                {/* VIDEO SRC DINAMIS DARI SLOT */}
                <source src={activeSlot.videoSrc} type="video/mp4" />
              </video>
              
            </div>
          )}

          {/* --- TAMPILAN 4: ERROR --- */}
          {status === 'error' && (
            <div className="absolute inset-0 z-50 bg-gradient-to-br from-red-300 via-pink-300 to-orange-200 backdrop-blur-sm rounded-[42px] flex flex-col items-center justify-center animate-shake text-center p-4">
              <div className="text-[100px] md:text-[140px] mb-6 animate-wiggle-big">😅</div>
              <h2 className="text-5xl md:text-7xl font-black text-red-600 mb-4 drop-shadow-lg animate-bounce">Oops! Coba Lagi!</h2>
              <div className="bg-white/90 px-10 py-4 rounded-3xl border-4 border-red-400 shadow-xl">
                <p className="text-xl md:text-3xl text-red-700 font-black">
                  🔍 Cari gambar yang cocok ya...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === FLOATING CONTROL BUTTON === */}
      <button
        onClick={() => setShowModal(!showModal)}
        className="fixed bottom-8 right-8 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-3xl md:text-4xl transform transition-all hover:scale-110 active:scale-95 border-4 border-white z-40 animate-bounce"
        title="Buka Panel Kontrol"
      >
        🎮
      </button>

      {/* === MODAL PANEL KONTROL === */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          {/* UBAH: Ukuran modal diperlebar (max-w-xl) agar lebih lega */}
          <div 
            className="bg-gradient-to-br from-purple-200 to-pink-200 p-6 md:p-8 rounded-[40px] border-6 border-purple-400 shadow-2xl w-full sm:max-w-xl max-h-[85vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="bg-white/80 rounded-3xl px-4 py-3 mb-6 border-4 border-purple-300 shadow-inner">
              <h3 className="text-purple-700 text-sm font-black uppercase tracking-wider text-center">
                🎮 Pilih Tantangan 🎮
              </h3>
            </div>

            {/* Slot Buttons (DINAMIS DARI SLOTS) */}
            <div className="flex flex-col gap-4 mb-6">
              {SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => {
                    handleSlotPress(slot);
                    setShowModal(false);
                  }}
                  className={`
                    group relative flex items-center gap-4 p-5 rounded-3xl transition-all duration-300
                    border-4 overflow-hidden transform hover:scale-105 active:scale-95
                    ${activeSlot.id === slot.id
                      ? 'bg-gradient-to-r from-yellow-300 to-orange-300 text-orange-900 scale-105 shadow-2xl border-orange-500 ring-4 ring-yellow-400'
                      : 'bg-white/90 hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 text-gray-700 border-gray-300 hover:border-cyan-400 shadow-lg'}
                  `}
                >
                  {activeSlot.id === slot.id && (
                      <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 animate-shimmer" />
                  )}

                  <div className={`text-4xl p-4 rounded-2xl shadow-lg transform group-hover:rotate-12 transition-transform ${activeSlot.id === slot.id ? 'bg-white/50' : 'bg-gradient-to-br from-yellow-200 to-orange-200'}`}>
                    {slot.icon}
                  </div>

                  <div className="flex-1 text-left z-10">
                    <div className="font-black text-xl">{slot.name}</div>
                    <div className="text-xs font-bold uppercase tracking-wider mt-1">
                      {activeSlot.id === slot.id ? '✨ Sedang Aktif' : '👆 Klik untuk main'}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t-4 border-purple-300 my-6"></div>

            {/* Simulasi Buttons */}
            <div className="text-center mb-6">
              <span className="bg-white/90 text-green-700 text-xs font-black px-5 py-2 rounded-full uppercase tracking-wider border-4 border-green-500 shadow-lg inline-block">
                🔧 Mode Simulasi
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {/* Tombol Simulasi: Mengirim ID Kartu Benar Sesuai Slot Aktif */}
               <button
                 onClick={() => handleRFIDScan(activeSlot.correctCardId)}
                 className="bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-white py-4 rounded-2xl font-black text-base shadow-xl border-4 border-green-600 active:translate-y-2 transform transition-all hover:scale-105"
               >
                 ✅ Benar
               </button>
               <button
                 onClick={() => handleRFIDScan("WRONG_ID")}
                 className="bg-gradient-to-br from-red-400 to-pink-500 hover:from-red-300 hover:to-pink-400 text-white py-4 rounded-2xl font-black text-base shadow-xl border-4 border-red-600 active:translate-y-2 transform transition-all hover:scale-105"
               >
                 ❌ Salah
               </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes wiggle-big {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-8deg) scale(1.05); }
          75% { transform: rotate(8deg) scale(1.05); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </main>
  );
}