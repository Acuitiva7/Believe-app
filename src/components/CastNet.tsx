import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Anchor, Waves } from 'lucide-react';
import { responsesForNet } from '../data';

export function CastNet() {
  const [inputState, setInputState] = useState('');
  const [isCasting, setIsCasting] = useState(false);
  const [result, setResult] = useState<typeof responsesForNet[0] | null>(null);

  const handleCast = () => {
    if (!inputState.trim()) return;
    
    setIsCasting(true);
    setResult(null);

    // Simulate casting the net
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * responsesForNet.length);
      setResult(responsesForNet[randomIndex]);
      setIsCasting(false);
      setInputState('');
    }, 2500);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <section className="py-24 px-4 relative z-10 bg-belief-blue/40 border-y border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-10"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-belief-gold mb-4">Lanza tu Red</h2>
          <p className="text-belief-white/70 text-lg max-w-xl mx-auto">
            ¿Hay algo en tu mente que te preocupa o una meta por la que oras? 
            Escríbelo aquí y "echa la red" una vez más, confiando en Su palabra.
          </p>
        </motion.div>

        <div className="glass-panel rounded-3xl p-6 md:p-10 relative shadow-2xl">
          <AnimatePresence mode="wait">
            {!isCasting && !result && (
              <motion.div
                key="input-stage"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-6"
              >
                <textarea
                  value={inputState}
                  onChange={(e) => setInputState(e.target.value)}
                  placeholder="Escribe tu preocupación, meta u oración..."
                  className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 text-belief-white placeholder:text-belief-white/30 focus:outline-none focus:border-belief-gold/50 transition-colors resize-none font-sans"
                />
                <button
                  onClick={handleCast}
                  disabled={!inputState.trim()}
                  className="bg-belief-gold hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-belief-blue font-bold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 group w-full md:w-auto md:self-center uppercase text-sm tracking-widest"
                >
                  <Anchor className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                  Echar la red
                </button>
              </motion.div>
            )}

            {isCasting && (
              <motion.div
                key="casting-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="mb-6 relative"
                >
                  <Waves className="w-16 h-16 text-belief-gold" />
                  
                  {/* Ripples */}
                  <motion.div 
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-belief-gold rounded-full"
                  />
                  <motion.div 
                    animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                    transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                    className="absolute inset-0 border border-belief-gold rounded-full"
                  />
                </motion.div>
                <p className="font-serif text-xl animate-pulse text-belief-white/80">
                  Lanzando la red sobre las aguas...
                </p>
              </motion.div>
            )}

            {result && !isCasting && (
              <motion.div
                key="result-stage"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex flex-col items-center text-center py-4"
              >
                <div className="w-full p-8 bg-black/20 rounded-2xl border border-belief-gold/20 mb-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-belief-gold"></div>
                  <p className="font-serif text-2xl md:text-3xl text-belief-white mb-4 leading-relaxed">
                    "{result.verse}"
                  </p>
                  <span className="text-belief-gold font-bold tracking-widest uppercase text-sm block mb-6">
                    {result.reference}
                  </span>
                  <div className="h-px w-1/4 bg-white/10 mx-auto mb-6" />
                  <p className="text-belief-white/80 italic font-light">
                    {result.reflection}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-belief-white/60 hover:text-belief-white underline underline-offset-4 text-sm transition-colors"
                >
                  Volver a intentar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
