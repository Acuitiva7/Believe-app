import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenLine, Trash2, Heart, MessageCircle } from 'lucide-react';

interface JournalEntry {
  id: number;
  text: string;
  type: string;
  date: string;
}

export function Journal({ userId }: { userId?: string }) {
  const currentUserId = userId || 'default';
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [text, setText] = useState('');
  const [type, setType] = useState('reflexión');

  useEffect(() => {
    const saved = localStorage.getItem(`belief-journal-${currentUserId}`);
    if (saved) {
      setEntries(JSON.parse(saved));
    } else {
      setEntries([]);
    }
  }, [currentUserId]);

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
    localStorage.setItem(`belief-journal-${currentUserId}`, JSON.stringify(updated));
    setText('');
  };

  const deleteEntry = (id: number) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem(`belief-journal-${currentUserId}`, JSON.stringify(updated));
  };

  return (
    <section id="journal" className="py-24 px-4 relative z-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-slate-900 mb-4 font-bold tracking-tight">Diario Espiritual</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-lg leading-relaxed">
            Guarda tus reflexiones, registra peticiones o escribe tus agradecimientos diarios en la gracia.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl h-fit border border-slate-200 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-2 mb-8 text-primary relative z-10">
              <PenLine className="w-6 h-6" />
              <h3 className="font-sans font-bold text-xl text-slate-800">Nueva Entrada</h3>
            </div>
            
            <div className="flex gap-2 mb-6 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl relative z-10">
              {['reflexión', 'petición', 'gratitud'].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2.5 px-3 text-xs sm:text-sm rounded-xl capitalize font-semibold transition-all ${
                    type === t 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
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
              className="w-full h-48 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow resize-none text-sm mb-6 relative z-10"
            />
            
            <button
              onClick={saveEntry}
              disabled={!text.trim()}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition-colors shadow-sm relative z-10"
            >
              Guardar en mi diario
            </button>
          </motion.div>

          <div className="space-y-4">
            <AnimatePresence>
              {entries.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-slate-50 p-12 rounded-3xl text-center border border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[300px]"
                >
                  <PenLine className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium text-lg">
                    Aún no hay entradas en tu diario. <br/> Comienza a escribir tu viaje de fe.
                  </p>
                </motion.div>
              ) : (
                entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-6 sm:p-8 rounded-3xl relative group border border-slate-200 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        {entry.type === 'gratitud' && <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Heart className="w-4 h-4" /></div>}
                        {entry.type === 'petición' && <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><MessageCircle className="w-4 h-4" /></div>}
                        {entry.type === 'reflexión' && <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><PenLine className="w-4 h-4" /></div>}
                        <span className="text-xs uppercase tracking-widest font-bold text-slate-600">
                          {entry.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">{entry.date}</span>
                        <button 
                          onClick={() => deleteEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500 p-1 sm:-mr-2 object-cover"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
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
