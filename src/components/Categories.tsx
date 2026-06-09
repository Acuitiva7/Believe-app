import { motion } from 'motion/react';
import { categories } from '../data';
import * as Icons from 'lucide-react';

export function Categories() {
  return (
    <section id="categories" className="py-24 px-4 relative z-10 w-full">
      <div className="max-w-6xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-belief-gold mb-4">Navega por la Palabra</h2>
          <p className="text-belief-white/70 max-w-xl mx-auto font-light">
            Encuentra dirección, aliento o paz en diferentes momentos de tu camino espiritual.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, index) => {
            const Icon = (Icons as any)[cat.icon];
            
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center mb-4 group-hover:bg-belief-gold/20 transition-colors border border-white/5">
                  {Icon && <Icon className="w-6 h-6 text-belief-gold" />}
                </div>
                <h3 className="font-sans font-medium text-belief-white tracking-wide">
                  {cat.name}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
