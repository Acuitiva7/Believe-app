import { motion } from 'motion/react';
import { ArrowDown, Flame } from 'lucide-react';

export function Hero({ setCurrentView, user }: { setCurrentView: (v: string) => void, user?: any }) {
  const scrollToNext = () => {
    document.getElementById('word-of-day')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="z-10 flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center border-belief-gold/30 mb-4 shadow-lg">
            <Flame className="w-8 h-8 text-belief-gold" />
          </div>
        </motion.div>
        
        <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-belief-white to-belief-gold mb-6">
          BELIEVE
        </h1>
        
        <p className="font-sans text-lg md:text-2xl text-belief-white/80 font-light tracking-wide max-w-2xl mb-12">
          "Mas en tu palabra echaré la red"
        </p>

        <div className="relative glass-panel rounded-2xl p-8 max-w-xl mx-auto mb-16 before:absolute before:-inset-[1px] before:rounded-2xl before:border before:border-belief-gold/20 before:-z-10 bg-black/20">
          <p className="font-serif italic text-2xl md:text-3xl text-belief-white leading-relaxed mb-4">
            "Pero por tu palabra echaré la red."
          </p>
          <span className="font-sans text-sm md:text-base text-belief-gold font-medium uppercase tracking-widest">
            Lucas 5:5
          </span>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center items-center w-full max-w-3xl mx-auto">
          <button 
            onClick={() => setCurrentView('map')}
            className="w-full sm:w-auto px-8 py-4 bg-brand-1 hover:bg-brand-2 text-white hover:text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm shadow-xl cursor-pointer"
          >
            Directorio Global
          </button>
          {!user ? (
            <>
              <button 
                onClick={() => setCurrentView('login')}
                className="w-full sm:w-auto px-8 py-4 glass-panel glass-panel-hover font-bold rounded-full transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm cursor-pointer hover:text-brand-3"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => setCurrentView('register')}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-brand-3 text-brand-3 hover:bg-brand-3 hover:text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm cursor-pointer"
              >
                Registrarse
              </button>
            </>
          ) : (
            <button 
              onClick={() => setCurrentView('user-dashboard')}
              className="w-full sm:w-auto px-8 py-4 glass-panel glass-panel-hover font-bold rounded-full transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm cursor-pointer hover:text-brand-3"
            >
              Ir a mi Feed
            </button>
          )}
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-10 z-10 cursor-pointer p-4"
        onClick={scrollToNext}
      >
        <ArrowDown className="w-6 h-6 text-belief-white/50 hover:text-brand-3 transition-colors" />
      </motion.div>
    </section>
  );
}
