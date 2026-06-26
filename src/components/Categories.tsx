import { motion } from 'motion/react';
import { categories } from '../data';
import * as Icons from 'lucide-react';

export function Categories({ setCurrentView }: { setCurrentView?: (v: string) => void }) {
  return (
    <section id="categories" className="py-24 px-4 relative z-10 w-full bg-slate-50 font-sans">
      <div className="max-w-6xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-slate-900 mb-4 font-bold tracking-tight">Navega por la Palabra</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-lg leading-relaxed">
            Encuentra dirección, aliento o paz en diferentes momentos de tu camino espiritual.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, index) => {
            const Icon = (Icons as any)[cat.icon];
            
            return (
              <motion.div
                key={cat.id}
                onClick={() => setCurrentView?.(`category-${cat.id}`)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer group border border-slate-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-4 group-hover:bg-brand-1 group-hover:text-white transition-colors text-brand-1 shadow-sm group-hover:scale-110 duration-300">
                  {Icon && <Icon className="w-6 h-6" />}
                </div>
                <h3 className="font-sans font-bold text-slate-800 tracking-wide text-sm md:text-base">
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
