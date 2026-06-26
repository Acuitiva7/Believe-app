import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserCircle2, Send } from 'lucide-react';

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  time: string;
}

export function Community({ user }: { user?: any }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('belief-testimonials');
    if (saved) {
      setTestimonials(JSON.parse(saved));
    }
  }, []);

  const handlePost = () => {
    if (!newTestimonial.trim() || !user) return;
    
    const userId = user.email || 'default';
    const userName = localStorage.getItem(`belief-user-name-${userId}`) || user.email?.split('@')[0] || 'Usuario Believe';
    
    const newEntry: Testimonial = {
      id: Date.now().toString(),
      name: userName,
      content: newTestimonial.trim(),
      time: new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
    };

    const updated = [newEntry, ...testimonials];
    setTestimonials(updated);
    localStorage.setItem('belief-testimonials', JSON.stringify(updated));
    setNewTestimonial('');
  };

  return (
    <section className="py-24 px-4 relative z-10 bg-slate-50 border-t border-slate-100 font-sans">
      <div className="max-w-6xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-slate-900 mb-4 font-bold tracking-tight">Comunidad de Fe</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-lg leading-relaxed">
            Testimonios de quienes decidieron volver a lanzar las redes.
          </p>
        </motion.div>

        {user && (
          <div className="mb-12 max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={newTestimonial}
              onChange={(e) => setNewTestimonial(e.target.value)}
              placeholder="Comparte tu testimonio..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full py-3 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-1/50 transition-shadow" 
              onKeyDown={(e) => e.key === 'Enter' && handlePost()}
            />
            <button 
              onClick={handlePost}
              className="px-6 py-3 bg-brand-1 text-white font-bold text-sm rounded-full hover:bg-brand-2 transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              Publicar <Send className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.length > 0 ? (
            testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl flex flex-col border border-slate-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-brand-1 shadow-sm">
                    <UserCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-slate-900">
                      {t.name}
                    </h4>
                  </div>
                </div>
                <p className="font-sans text-slate-700 text-base leading-relaxed mb-6 flex-1 font-medium">
                  "{t.content}"
                </p>
                <span className="text-xs font-bold text-brand-1 bg-brand-1/5 w-fit px-3 py-1.5 rounded-full">{t.time}</span>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-slate-500 py-12">
              Aún no hay testimonios. {user ? '¡Sé el primero en compartir el tuyo!' : 'Inicia sesión para compartir el tuyo.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
