'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  
  const [isHovered, setIsHovered] = useState(false);

  return (
    <main className="relative w-full h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200 overflow-hidden font-sans">     
      
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-5 right-5 md:top-10 md:right-10 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center animate-spin-slow">
           <div className="text-7xl md:text-8xl drop-shadow-2xl">☀️</div>
        </div>
        <div className="absolute top-[10%] left-[5%] text-6xl opacity-80 animate-cloud-drift">☁️</div>
        <div className="absolute top-[20%] right-[15%] text-5xl opacity-70 animate-cloud-drift" style={{ animationDelay: '2s', animationDirection: 'reverse' }}>☁️</div>
        <div className="absolute top-[30%] left-[10%] text-5xl animate-bounce" style={{ animationDuration: '3s' }}>🚦</div>
        <div className="absolute bottom-[30%] right-[5%] text-6xl animate-pulse">🛑</div>
        <div className="absolute top-[40%] right-[20%] text-4xl animate-bounce" style={{ animationDuration: '4s' }}>🚧</div>

        {/* JALAN RAYA & RUMPUT */}
        <div className="absolute bottom-0 w-full">
            {/* Bukit Rumput */}
            <div className="absolute bottom-0 w-full h-32 md:h-48 bg-green-500 rounded-t-[50%] scale-125 border-t-8 border-green-600"></div>
            <div className="absolute bottom-0 -left-20 w-full h-24 md:h-40 bg-green-400 rounded-t-[40%] scale-110 border-t-8 border-green-500"></div>
            {/* Jalan Raya */}
            <div className="absolute bottom-0 w-full h-16 md:h-24 bg-gray-700 border-t-4 border-gray-800 flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-0 border-t-4 border-dashed border-white opacity-50 absolute top-1/2 transform -translate-y-1/2"></div>
                <div className="absolute bottom-2 left-[-10%] text-5xl animate-car-drive transform -scale-x-100">🚗</div>
                <div className="absolute bottom-4 left-[-10%] text-5xl animate-car-drive transform -scale-x-100" style={{ animationDelay: '3s', animationDuration: '8s' }}>🚌</div>
                <div className="absolute bottom-3 left-[-10%] text-4xl animate-car-drive transform -scale-x-100" style={{ animationDelay: '1s', animationDuration: '5s' }}>🛵</div>
            </div>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="relative w-full h-full flex flex-col items-center justify-center z-20 p-4">
        <div className="w-full max-w-3xl bg-white/90 backdrop-blur-sm rounded-[40px] border-8 border-yellow-400 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center p-6 md:p-10 text-center transform hover:scale-[1.01] transition-transform duration-300">
          <div className="absolute inset-0 rounded-[32px] border-4 border-pink-200 pointer-events-none"></div>

          {/* VIDEO/ANIMASI IDLE */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 mb-4 rounded-full overflow-hidden shadow-2xl border-8 border-white ring-4 ring-yellow-300 bg-sky-200">
             <video 
                autoPlay loop muted playsInline 
                className="w-full h-full object-cover"
             >
                <source src="/videos/tampilan_utama1.mp4" type="video/mp4" />
                <div className="w-full h-full flex items-center justify-center text-6xl">👮‍♂️</div>
             </video>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 drop-shadow-sm leading-tight">
            PETUALANGAN<br/>
            <span className="text-orange-500">RAMBU LALU LINTAS</span>
          </h1>

          {/* TOMBOL MULAI ) */}
          <div className="relative inline-block group z-30">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200 animate-pulse"></div>
            
            <Link href="/game">
                <button 
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative px-8 py-4 md:px-12 md:py-5 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 rounded-full flex items-center justify-center transform active:scale-95 transition-all shadow-xl border-4 border-white"
                >
                  <span className="text-2xl md:text-4xl font-black text-white drop-shadow-md flex items-center gap-3">
                     <svg 
                       width="36" 
                       height="36" 
                       viewBox="0 0 24 24" 
                       fill="none" 
                       xmlns="http://www.w3.org/2000/svg"
                       className="drop-shadow-sm fill-current"
                     >
                        <path d="M5 3L19 12L5 21V3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                     AYO MULAI!
                  </span>
                </button>
            </Link>
          </div>

          <p className="mt-6 text-sm md:text-lg text-blue-700 font-bold bg-blue-100 px-6 py-2 rounded-full border-2 border-blue-200">
             Siapkan Kartu Ajaibmu ya! 
          </p>

        </div>
      </div>

      <style jsx>{`
        @keyframes cloud-drift { 
            0% { transform: translateX(0px); } 
            100% { transform: translateX(20px); } 
        }
        @keyframes spin-slow { 
            from { transform: rotate(0deg); } 
            to { transform: rotate(360deg); } 
        }
        @keyframes car-drive {
            0% { left: -15%; }
            100% { left: 115%; }
        }
        .animate-cloud-drift {
            animation: cloud-drift 4s infinite alternate ease-in-out;
        }
        .animate-car-drive {
            animation: car-drive 10s linear infinite;
        }
        .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </main>
  );
}