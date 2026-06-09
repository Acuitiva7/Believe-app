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
      alert("Enlace copiado al portapapeles.");
    }
  };

  return (
    <section id="word-of-day" className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-belief-gold mb-4">Palabra del Día</h2>
          <div className="w-16 h-[1px] bg-belief-gold/50 mx-auto"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          {/* Subtle light effect top right */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-belief-gold/10 rounded-full blur-3xl"></div>

          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="flex-1">
              <BookOpen className="w-8 h-8 text-belief-gold mb-6 opacity-80" />
              <blockquote className="font-serif text-3xl md:text-4xl leading-tight text-belief-white mb-6">
                "{dailyWord.verse}"
              </blockquote>
              <p className="font-sans text-belief-gold uppercase tracking-widest font-semibold mb-8">
                {dailyWord.reference}
              </p>
              <div className="p-6 bg-belief-blue/30 rounded-2xl border border-belief-white/5">
                <p className="font-sans text-belief-white/80 leading-relaxed">
                  {dailyWord.reflection}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end relative z-10">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-white/10 transition-colors text-belief-white/90 border border-white/10 text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              Compartir Palabra
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
