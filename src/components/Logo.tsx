import { motion } from 'motion/react';
import { useState } from 'react';

export function Logo({ className }: { className?: string }) {
  const [imgSrc, setImgSrc] = useState('/logo.svg');

  return (
    <motion.div 
      className={`relative flex items-center justify-center ${className}`}
      // Flotación vertical muy suave y efecto de respiración ligero (escala)
      animate={{ 
        y: [0, -6, 0], 
        scale: [1, 1.01, 1],
        rotate: [0, 0.5, 0, -0.5, 0] // Rotación máxima de 1 grado (-0.5 a 0.5)
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Resplandor suave y ondas detrás del logo */}
      <motion.div 
        animate={{ 
          opacity: [0.4, 0.7, 0.4],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[#93C5FD] blur-3xl rounded-full mix-blend-multiply opacity-50 scale-150 z-0"
      />
      <motion.div 
        animate={{ 
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute inset-0 bg-[#2563EB] blur-[80px] rounded-full mix-blend-multiply opacity-30 scale-125 z-0"
      />

      {/* Imagen del Logo Original */}
      <div className="relative z-10 w-full h-full overflow-visible flex justify-center items-center">
        <motion.img 
          src={imgSrc} 
          alt="Believe Logo" 
          className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
          animate={{
            filter: [
              "drop-shadow(0 20px 13px rgb(0 0 0 / 0.05)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08)) brightness(1)", 
              "drop-shadow(0 20px 13px rgb(0 0 0 / 0.1)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.12)) brightness(1.05)",
              "drop-shadow(0 20px 13px rgb(0 0 0 / 0.05)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08)) brightness(1)"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          onError={() => {
            // Intenta cargar PNG si SVG falla
            if (imgSrc === '/logo.svg') {
              setImgSrc('/logo.png');
            }
          }}
        />
      </div>
    </motion.div>
  );
}
