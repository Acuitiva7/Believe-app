import { motion } from 'motion/react';
import { Users, Search, Sparkles } from 'lucide-react';

import { Logo } from './Logo';

export function Hero({ setCurrentView, user }: { setCurrentView: (v: string) => void, user?: any }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-white pt-24 font-sans border-b border-slate-100">
      
      {/* Background container */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">

        {/* Soft radial glows to mimic the logo's depth */}
        <div className="absolute top-1/4 left-[30%] w-[600px] h-[600px] bg-[#93C5FD]/30 blur-[100px] rounded-full mix-blend-multiply"></div>
        <div className="absolute bottom-1/4 right-[30%] w-[700px] h-[700px] bg-[#2563EB]/20 blur-[120px] rounded-full mix-blend-multiply"></div>
        
        {/* Fluid SVG Ribbons imitating the logo's interconnected net / waves */}
        <svg className="absolute w-full h-full opacity-80" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 800" fill="none">
          <defs>
            <linearGradient id="blue-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#2563EB" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="blue-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Morphing Wave Base */}
          <motion.path 
            animate={{ 
              d: [
                "M-200,400 C300,500 600,200 1000,400 C1400,600 1600,300 1800,400 L1800,900 L-200,900 Z",
                "M-200,500 C400,400 700,600 1100,400 C1500,200 1600,500 1800,400 L1800,900 L-200,900 Z",
                "M-200,400 C300,500 600,200 1000,400 C1400,600 1600,300 1800,400 L1800,900 L-200,900 Z"
              ] 
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            fill="url(#blue-gradient-2)"
          />

          {/* Ribbon Path (Net/Current) */}
          <motion.path 
             animate={{ 
               d: [
                 "M-100,200 C300,400 600,100 1000,500 C1300,800 1500,400 1600,500", 
                 "M-100,400 C400,200 700,600 1100,300 C1400,100 1500,600 1600,400", 
                 "M-100,200 C300,400 600,100 1000,500 C1300,800 1500,400 1600,500"
               ] 
             }}
             transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
             stroke="url(#blue-gradient-1)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6"
          />

          {/* Second Ribbon */}
          <motion.path 
             animate={{ 
               d: [
                 "M-100,600 C200,800 500,400 900,600 C1200,800 1400,300 1600,200", 
                 "M-100,700 C300,500 600,800 1000,500 C1300,300 1500,700 1600,600", 
                 "M-100,600 C200,800 500,400 900,600 C1200,800 1400,300 1600,200"
               ] 
             }}
             transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }}
             stroke="url(#blue-gradient-1)" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7"
          />
        </svg>

        {/* Abstract Fluid Blobs inspired by the logo's shapes */}
        <motion.div
          animate={{
            rotate: [0, 90, 180, 270, 360],
            borderRadius: [
              "40% 60% 70% 30% / 40% 50% 60% 50%",
              "60% 40% 30% 70% / 60% 50% 40% 50%",
              "40% 60% 70% 30% / 40% 50% 60% 50%"
            ]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] border border-[#2563EB]/30 -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"
        />
        <motion.div
           animate={{
            rotate: [360, 270, 180, 90, 0],
            borderRadius: [
              "60% 40% 30% 70% / 60% 50% 40% 50%",
              "40% 60% 70% 30% / 40% 50% 60% 50%",
              "60% 40% 30% 70% / 60% 50% 40% 50%"
            ]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] border-[2px] border-[#93C5FD]/30 -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="z-10 flex flex-col items-center max-w-5xl mx-auto w-full relative"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#93C5FD]/20 blur-3xl scale-150 rounded-full"></div>
          <Logo className="w-[300px] h-[180px] md:w-[450px] md:h-[280px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="mb-8 flex items-center gap-2 px-6 py-3 rounded-full bg-white/70 backdrop-blur-md text-[#2563EB] font-bold text-sm uppercase tracking-widest border border-[#2563EB]/30 shadow-md ring-1 ring-inset ring-[#93C5FD]/40"
        >
          <Sparkles className="w-5 h-5" />
          <span>"Mas en tu palabra echaré la red"</span>
        </motion.div>
        
        <h2 className="font-sans text-xl md:text-3xl tracking-tight font-bold text-slate-700 mb-6 max-w-3xl leading-snug drop-shadow-sm">
          Conectando creyentes, iglesias y comunidades en un solo lugar.
        </h2>

        <p className="font-sans text-base md:text-lg text-slate-600 font-medium max-w-2xl mb-14 leading-relaxed">
          Encuentra una iglesia, fortalece tu fe y forma parte de una comunidad que crece unida.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full relative z-20">
          <button 
            onClick={() => setCurrentView('map')}
            className="w-full sm:w-auto px-10 py-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-full transition-all shadow-xl shadow-[#2563EB]/20 hover:shadow-[#2563EB]/40 flex items-center justify-center gap-3 text-sm uppercase tracking-wider cursor-pointer border border-transparent hover:-translate-y-0.5"
          >
            <Search className="w-5 h-5" />
            Explorar Iglesias
          </button>
          <button 
            onClick={() => setCurrentView(user ? 'admin-dashboard' : 'register')}
            className="w-full sm:w-auto px-10 py-5 bg-white/80 backdrop-blur-md hover:bg-white text-slate-800 font-bold rounded-full transition-all shadow-sm shadow-slate-200 flex items-center justify-center gap-3 text-sm uppercase tracking-wider cursor-pointer border border-[#93C5FD]/50 hover:-translate-y-0.5"
          >
            <Users className="w-5 h-5 text-[#2563EB]" />
            Crear Comunidad
          </button>
        </div>

      </motion.div>
    </section>
  );
}
