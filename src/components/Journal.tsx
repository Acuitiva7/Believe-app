import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenLine, Trash2, Heart, MessageCircle } from 'lucide-react';

interface JournalEntry {
  id: number;
  text: string;
  type: string;
  date: string;
}

export function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [text, setText] = useState('');
  const [type, setType] = useState('reflexión');

  useEffect(() => {
    const saved = localStorage.getItem('belief-journal');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const saveEntry = () => {
    if (!text.trim()) return;
    
    const newEntry: JournalEntry = {
      id: Date.now(),
      text,
      type,
      date: new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      })
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('belief-journal', JSON.stringify(updated));
    setText('');
  };

  const deleteEntry = (id: number) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('belief-journal', JSON.stringify(updated));
  };

  return (
    <section id="journal" className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-belief-gold mb-4">Diario Espiritual</h2>
          <p className="text-belief-white/70 max-w-xl mx-auto font-light">
            Guarda tus reflexiones, registra peticiones o escribe tus agradecimientos diarios.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-3xl h-fit border-t-belief-gold/30"
          >
            <div className="flex items-center gap-2 mb-6 text-belief-gold">
              <PenLine className="w-5 h-5" />
              <h3 className="font-sans font-medium text-lg">Nueva Entrada</h3>
            </div>
            
            <div className="flex gap-2 mb-4 bg-black/20 p-1 rounded-xl">
              {['reflexión', 'petición', 'gratitud'].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 px-3 text-xs md:text-sm rounded-lg capitalize font-medium transition-colors ${
                    type === t 
                      ? 'bg-belief-gold text-belief-blue shadow' 
                      : 'text-belief-white/60 hover:text-belief-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe lo que hay en tu corazón hoy..."
              className="w-full h-40 bg-black/20 border border-white/5 rounded-xl p-4 text-belief-white placeholder:text-belief-white/30 focus:outline-none focus:border-belief-gold/30 transition-colors resize-none text-sm mb-4"
            />
            
            <button
              onClick={saveEntry}
              disabled={!text.trim()}
              className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-belief-white font-medium py-3 rounded-xl transition-colors border border-white/10"
            >
              Guardar en mi diario
            </button>
          </motion.div>

          <div className="space-y-4">
            <AnimatePresence>
              {entries.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass-panel p-8 rounded-3xl text-center border-dashed border-white/20"
                >
                  <p className="text-belief-white/50 font-light text-sm">
                    Aún no hay entradas en tu diario. Comienza a escribir tu viaje de fe.
                  </p>
                </motion.div>
              ) : (
                entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-panel p-6 rounded-2xl relative group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {entry.type === 'gratitud' && <Heart className="w-4 h-4 text-rose-400" />}
                        {entry.type === 'petición' && <MessageCircle className="w-4 h-4 text-blue-300" />}
                        {entry.type === 'reflexión' && <PenLine className="w-4 h-4 text-belief-gold" />}
                        <span className="text-xs uppercase tracking-wider font-semibold text-belief-white/50">
                          {entry.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-belief-gold/70">{entry.date}</span>
                        <button 
                          onClick={() => deleteEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400/70 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-belief-white/90 text-sm leading-relaxed whitespace-pre-wrap font-light">
                      {entry.text}
                    </p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
