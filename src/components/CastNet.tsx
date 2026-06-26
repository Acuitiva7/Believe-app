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
    <section className="py-24 px-4 relative z-10 bg-primary/5 border-y border-primary/10 overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-12"
        >
          <div className="flex justify-center mb-4">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200">
               <Anchor className="w-8 h-8 text-primary" />
             </div>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-slate-900 mb-6 font-bold tracking-tight">Lanza tu Red</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            ¿Hay algo en tu mente que te preocupa o una meta por la que oras? 
            Escríbelo aquí y "echa la red" una vez más, confiando en Su palabra.
          </p>
        </motion.div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 relative shadow-xl shadow-primary/5 border border-slate-200/60 max-w-3xl mx-auto">
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
                  placeholder="Escribe tu preocupación, tu fe u oración..."
                  className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow resize-none font-sans text-base leading-relaxed"
                />
                <button
                  onClick={handleCast}
                  disabled={!inputState.trim()}
                  className="bg-primary disabled:opacity-50 hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-full transition-all flex items-center justify-center gap-3 w-full sm:w-auto mx-auto shadow-md"
                >
                  <Anchor className="w-5 h-5" /> 
                  <span className="uppercase tracking-widest text-sm">Echar la Red</span>
                </button>
              </motion.div>
            )}

            {isCasting && (
              <motion.div
                key="casting-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="py-16 flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{ 
                    y: [0, 15, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Waves className="w-16 h-16 text-primary/60 mb-6" />
                </motion.div>
                <h3 className="font-serif text-2xl text-slate-800 font-bold tracking-tight">Echando la red...</h3>
                <p className="text-slate-500 mt-2 font-medium">Bajo tu palabra, esperaremos.</p>
              </motion.div>
            )}

            {result && !isCasting && (
              <motion.div
                key="result-stage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-4 md:px-8"
              >
                <div className="bg-amber-50 p-8 md:p-10 rounded-[2rem] border border-amber-100 shadow-sm relative overflow-hidden text-left mb-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                  <h3 className="font-sans font-bold text-lg text-amber-800 mb-4 tracking-wider flex items-center gap-2">
                    RECOLECCIÓN
                  </h3>
                  <p className="font-serif text-2xl md:text-3xl text-slate-900 leading-snug mb-6 font-bold">
                    "{result.verse}"
                  </p>
                  <div className="h-px w-full bg-amber-200/50 mb-6"></div>
                  <p className="font-sans text-slate-700 leading-relaxed font-medium">
                    {result.reflection}
                  </p>
                </div>
                
                <button
                  onClick={handleReset}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-8 rounded-full transition-colors font-sans text-sm tracking-wider uppercase"
                >
                  Intentar de Nuevo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
