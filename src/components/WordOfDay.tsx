import { motion } from 'motion/react';
import { Share2, BookOpen } from 'lucide-react';
import { dailyWord } from '../data';

export function WordOfDay() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Palabra del Día - Believe',
        text: `"${dailyWord.verse}" - ${dailyWord.reference}\n\n${dailyWord.reflection}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("La función de compartir no está disponible. Intenta copiar la cita manualmente.");
    }
  };

  return (
    <section id="word-of-day" className="py-24 px-4 relative z-10 bg-white border-y border-slate-100 font-sans">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-3">
             <span className="text-xs uppercase tracking-widest text-primary font-bold bg-primary/5 px-3 py-1.5 rounded-full">Inspiración Diaria</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-slate-900 mb-4 font-bold tracking-tight">Palabra del Día</h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden shadow-sm"
        >
          {/* Subtle light effect top right */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl -mt-20 -mr-20 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-10 relative z-10 items-center md:items-start">
            <div className="flex-1 text-center md:text-left">
              <BookOpen className="w-10 h-10 text-primary mb-6 mx-auto md:mx-0 opacity-80" />
              <blockquote className="font-serif font-bold text-3xl md:text-4xl leading-tight text-slate-900 mb-6">
                "{dailyWord.verse}"
              </blockquote>
              <span className="inline-block px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold tracking-widest text-xs uppercase rounded-xl mb-8 shadow-sm">
                {dailyWord.reference}
              </span>
              <p className="font-sans text-slate-600 text-lg md:text-xl leading-relaxed font-medium">
                {dailyWord.reflection}
              </p>
            </div>
          </div>
          <div className="mt-8 flex justify-end relative z-10 w-full md:w-auto mt-6 md:mt-0 flex items-center justify-center gap-2">
            <button 
              onClick={handleShare}
              className="w-full md:w-auto mt-6 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-primary hover:bg-primary hover:text-white px-8 py-4 rounded-2xl transition-all shadow-sm text-slate-700 font-bold tracking-wider text-sm uppercase group"
            >
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
              <span>Compartir Palabra</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
