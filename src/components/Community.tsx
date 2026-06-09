import { motion } from 'motion/react';
import { mockTestimonials } from '../data';
import { UserCircle2 } from 'lucide-react';

export function Community() {
  return (
    <section className="py-24 px-4 relative z-10 bg-black/20 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-belief-gold mb-4">Comunidad de Fe</h2>
          <p className="text-belief-white/70 max-w-xl mx-auto font-light">
            Testimonios de quienes decidieron volver a lanzar las redes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {mockTestimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-6 rounded-2xl flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-belief-blue flex items-center justify-center text-belief-gold">
                  <UserCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-sans font-medium text-belief-white text-sm">
                    {t.name}
                  </h4>
                  <span className="text-xs text-belief-white/40">{t.handle}</span>
                </div>
              </div>
              <p className="font-sans text-belief-white/80 text-sm leading-relaxed mb-4 flex-1 font-light">
                {t.content}
              </p>
              <span className="text-xs text-belief-gold/60">{t.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
