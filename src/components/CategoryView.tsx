import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { categories, categoryPromises } from '../data';
import * as Icons from 'lucide-react';

export function CategoryView({ categoryId, setCurrentView }: { categoryId: string; setCurrentView: (v: string) => void }) {
  const category = categories.find(c => c.id === categoryId);
  const promises = categoryPromises[categoryId] || [];
  
  if (!category) return null;
  const Icon = (Icons as any)[category.icon];

  return (
    <div className="min-h-screen pt-32 px-4 pb-24 text-slate-800 bg-slate-50 font-sans">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => setCurrentView('home')} 
          className="flex items-center gap-2 text-slate-500 hover:text-brand-1 transition-colors mb-8 text-sm uppercase tracking-widest font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-brand-1/10 text-brand-1 flex items-center justify-center">
            {Icon && <Icon className="w-8 h-8" />}
          </div>
          <div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Promesas de {category.name}</h1>
            <p className="text-slate-600 mt-2 text-lg">Palabras de aliento enfocadas en {category.name.toLowerCase()}.</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {promises.map((promise, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl relative overflow-hidden group border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-1/30 transition-all duration-300"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-1/5 rounded-full blur-2xl group-hover:bg-brand-1/10 transition-colors duration-500"></div>
              <h3 className="font-serif font-bold text-2xl text-slate-900 mb-4 relative z-10">{promise.title}</h3>
              <p className="font-sans text-slate-600 text-base leading-relaxed mb-8 relative z-10">"{promise.text}"</p>
              <div className="mt-auto relative z-10">
                <span className="inline-block px-4 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold tracking-widest uppercase rounded-xl">
                  {promise.ref}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {promises.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            Aún no hay promesas para esta categoría.
          </div>
        )}
      </div>
    </div>
  );
}
