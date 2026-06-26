import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { promiseCards } from '../data';
import { Sparkles } from 'lucide-react';

export function Promises() {
  const [dailyPromises, setDailyPromises] = useState<typeof promiseCards>([]);

  useEffect(() => {
    const today = new Date();
    // Use the day of the year as a seed
    const seed = today.getFullYear() * 1000 + Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Simple pseudo-random shuffle based on seed
    const shuffled = [...promiseCards].sort((a, b) => {
      const hashA = (a.id * seed) % 100;
      const hashB = (b.id * seed) % 100;
      return hashA - hashB;
    });

    setDailyPromises(shuffled.slice(0, 4));
  }, []);

  return (
    <section className="py-24 px-4 relative z-10 w-full overflow-hidden bg-white font-sans border-t border-slate-100">
      {/* Decorative large text behind */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-bold text-slate-50 pointer-events-none whitespace-nowrap z-0 selection:bg-transparent">
        PROMESAS
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-amber-50 p-3 rounded-2xl text-amber-500 shadow-sm border border-amber-100">
               <Sparkles className="w-8 h-8" />
            </div>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-slate-900 mb-4 font-bold tracking-tight">Promesas de Dios</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-lg leading-relaxed">
            Palabras eternas para sostenerte en medio de la incertidumbre.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dailyPromises.map((promise, index) => (
            <motion.div
              key={promise.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 flex flex-col h-full"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl group-hover:bg-amber-100 transition-colors duration-500"></div>
              
              <h3 className="font-serif font-bold text-2xl text-slate-900 mb-4 relative z-10">
                {promise.title}
              </h3>
              <p className="font-sans text-slate-600 text-sm md:text-base leading-relaxed mb-8 relative z-10 font-medium">
                "{promise.text}"
              </p>
              <div className="mt-auto relative z-10">
                <span className="inline-block px-4 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold tracking-widest uppercase rounded-xl shadow-sm">
                  {promise.ref}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
