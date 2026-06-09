import { motion } from 'motion/react';
import { promiseCards } from '../data';
import { Sparkles } from 'lucide-react';

export function Promises() {
  return (
    <section className="py-24 px-4 relative z-10 w-full overflow-hidden">
      {/* Decorative large text behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-bold text-white/5 pointer-events-none whitespace-nowrap z-0">
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
            <Sparkles className="w-8 h-8 text-belief-gold" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-belief-gold mb-4">Promesas de Dios</h2>
          <p className="text-belief-white/70 max-w-xl mx-auto font-light">
            Palabras eternas para sostenerte en medio de la incertidumbre.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promiseCards.map((promise, index) => (
            <motion.div
              key={promise.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 border-t-belief-gold/20"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-belief-gold/10 rounded-full blur-2xl group-hover:bg-belief-gold/20 transition-colors duration-500"></div>
              
              <h3 className="font-serif text-2xl text-belief-white mb-4 relative z-10">
                {promise.title}
              </h3>
              <p className="font-sans text-belief-white/80 text-sm leading-relaxed mb-6 relative z-10 font-light">
                "{promise.text}"
              </p>
              <div className="mt-auto relative z-10">
                <span className="inline-block px-3 py-1 bg-belief-gold/10 text-belief-gold text-xs font-bold tracking-widest uppercase rounded-full">
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
