import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PenLine, Trash2, Heart, MessageCircle, BookOpen, 
  Search, Star, Tag, Calendar, Filter, Sparkles, Plus, X, HandHeart
} from 'lucide-react';

interface JournalEntry {
  id: number;
  text: string;
  type: string;
  date: string;
  tags: string[];
  isFavorite: boolean;
}

interface CustomTag {
  id: string;
  label: string;
  color: string;
}

const PREDEFINED_TAGS: CustomTag[] = [
  { id: 'familia', label: 'Familia', color: 'bg-purple-100 text-purple-700' },
  { id: 'amigos', label: 'Amigos', color: 'bg-green-100 text-green-700' },
  { id: 'trabajo', label: 'Trabajo', color: 'bg-orange-100 text-orange-700' },
  { id: 'iglesia', label: 'Iglesia', color: 'bg-blue-100 text-blue-700' },
  { id: 'sanidad', label: 'Sanidad', color: 'bg-red-100 text-red-700' },
  { id: 'finanzas', label: 'Finanzas', color: 'bg-yellow-100 text-yellow-700' },
];

const COLORS = [
  'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 
  'bg-orange-100 text-orange-700', 'bg-blue-100 text-blue-700', 
  'bg-red-100 text-red-700', 'bg-yellow-100 text-yellow-700', 
  'bg-teal-100 text-teal-700', 'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700', 'bg-cyan-100 text-cyan-700'
];

export function Journal({ userId }: { userId?: string }) {
  const currentUserId = userId || 'default';
  
  // State
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [customTags, setCustomTags] = useState<CustomTag[]>(PREDEFINED_TAGS);
  
  // Editor State
  const [text, setText] = useState('');
  const [type, setType] = useState('reflexión');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // List State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);
  
  // UI State
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(`belief-journal-${currentUserId}`);
    if (saved) setEntries(JSON.parse(saved));
    
    const savedTags = localStorage.getItem(`belief-custom-tags-${currentUserId}`);
    if (savedTags) setCustomTags(JSON.parse(savedTags));
  }, [currentUserId]);

  // Derived stats
  const stats = useMemo(() => {
    return {
      total: entries.length,
      reflexion: entries.filter(e => e.type === 'reflexión').length,
      peticion: entries.filter(e => e.type === 'petición').length,
      gratitud: entries.filter(e => e.type === 'gratitud').length,
      lastDate: entries.length > 0 ? entries[0].date.split(',')[0] : 'Ninguna'
    };
  }, [entries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchSearch = entry.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          entry.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchFavorite = filterFavorite ? entry.isFavorite : true;
      const matchType = filterType ? entry.type === filterType : true;
      return matchSearch && matchFavorite && matchType;
    });
  }, [entries, searchQuery, filterFavorite, filterType]);

  const saveEntry = () => {
    if (!text.trim()) return;
    
    const newEntry: JournalEntry = {
      id: Date.now(),
      text,
      type,
      tags: selectedTags,
      isFavorite: false,
      date: new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      })
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem(`belief-journal-${currentUserId}`, JSON.stringify(updated));
    setText('');
    setSelectedTags([]);
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const deleteEntry = (id: number) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem(`belief-journal-${currentUserId}`, JSON.stringify(updated));
  };

  const toggleFavorite = (id: number) => {
    const updated = entries.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e);
    setEntries(updated);
    localStorage.setItem(`belief-journal-${currentUserId}`, JSON.stringify(updated));
  };

  const createCustomTag = () => {
    if (!newTagLabel.trim()) return;
    const newTag: CustomTag = {
      id: newTagLabel.toLowerCase().replace(/\s+/g, '-'),
      label: newTagLabel.trim(),
      color: COLORS[customTags.length % COLORS.length]
    };
    const updatedTags = [...customTags, newTag];
    setCustomTags(updatedTags);
    localStorage.setItem(`belief-custom-tags-${currentUserId}`, JSON.stringify(updatedTags));
    setNewTagLabel('');
    setShowTagModal(false);
  };

  const deleteTag = (id: string) => {
    const updatedTags = customTags.filter(t => t.id !== id);
    setCustomTags(updatedTags);
    localStorage.setItem(`belief-custom-tags-${currentUserId}`, JSON.stringify(updatedTags));
  };

  return (
    <section className="py-12 relative z-10 font-sans w-full max-w-7xl mx-auto">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-2 font-bold tracking-tight">Diario Espiritual</h2>
          <p className="text-slate-500 text-base">Un espacio íntimo para hablar con Dios cada día.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-4">
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Entradas</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{stats.reflexion}</p>
              <p className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Reflex.</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{stats.lastDate !== 'Ninguna' ? stats.lastDate.split(' ')[0] : '-'}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Última</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Notebook Wrapper */}
      <div className="bg-slate-800/90 rounded-[2.5rem] p-2 sm:p-3 shadow-2xl relative w-full mb-12">
        {/* Ribbon */}
        <div className="hidden md:block absolute right-[-1rem] top-32 w-8 h-16 bg-brand-1 rounded-r-lg shadow-md z-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 80%)' }}></div>
        
        {/* Pages Container */}
        <div className="bg-slate-50 flex flex-col md:flex-row rounded-[2rem] min-h-[700px] relative z-10 shadow-inner overflow-hidden">
          
          {/* Central binding (rings) - Desktop only */}
          <div className="hidden md:flex absolute left-1/2 top-10 bottom-10 w-12 -translate-x-1/2 flex-col justify-between items-center z-20 pointer-events-none">
             {[...Array(14)].map((_, i) => (
                <div key={i} className="flex items-center w-full">
                   <div className="w-3 h-3 rounded-full bg-slate-300 shadow-inner"></div>
                   <div className="flex-1 h-1.5 bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200 shadow-sm rounded-full -mx-0.5"></div>
                   <div className="w-3 h-3 rounded-full bg-slate-300 shadow-inner"></div>
                </div>
             ))}
          </div>
          {/* Crease shadow */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-12 -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-900/5 to-transparent pointer-events-none z-10"></div>

          {/* LEFT PAGE - Editor */}
          <div className="flex-1 p-6 sm:p-10 md:p-12 relative bg-white border-b md:border-b-0 md:border-r border-slate-200 md:pr-16">
            <div className="flex items-center gap-3 mb-8 text-brand-1">
              <PenLine className="w-5 h-5" />
              <h3 className="font-serif font-bold text-2xl text-slate-800">Nueva Entrada</h3>
            </div>
            
            {/* Tabs for Entry Type */}
            <div className="flex gap-2 mb-6 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl">
              {[
                { id: 'reflexión', icon: BookOpen, color: 'text-amber-600', active: 'bg-white shadow-sm text-amber-700 border border-slate-200/50' },
                { id: 'petición', icon: HandHeart, color: 'text-sky-600', active: 'bg-white shadow-sm text-sky-700 border border-slate-200/50' },
                { id: 'gratitud', icon: Heart, color: 'text-rose-600', active: 'bg-white shadow-sm text-rose-700 border border-slate-200/50' }
              ].map((t) => {
                const Icon = t.icon;
                const isActive = type === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`flex-1 py-3 px-3 flex items-center justify-center gap-2 text-xs sm:text-sm rounded-xl capitalize font-bold transition-all ${
                      isActive ? t.active : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? t.color : ''}`} />
                    <span className="hidden sm:inline">{t.id}</span>
                  </button>
                )
              })}
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe lo que hay en tu corazón hoy..."
              className="w-full h-48 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-1/40 focus:bg-white transition-all resize-none text-base leading-relaxed mb-6"
            />
            
            {/* Tags section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 flex items-center gap-1"><Tag className="w-4 h-4"/> Etiquetas</span>
                <button onClick={() => setShowTagModal(true)} className="text-xs font-semibold text-brand-1 hover:text-brand-2">Gestionar</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {customTags.map(tag => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => setSelectedTags(prev => isSelected ? prev.filter(t => t !== tag.id) : [...prev, tag.id])}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        isSelected 
                          ? `${tag.color} border-transparent ring-2 ring-offset-1 ring-${tag.color.split(' ')[0].replace('bg-', '')}` 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {tag.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              onClick={saveEntry}
              disabled={!text.trim()}
              className="w-full bg-brand-1 hover:bg-brand-2 disabled:opacity-50 disabled:hover:bg-brand-1 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              {saveSuccess ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" /> ¡Guardado!
                </motion.span>
              ) : (
                <>Guardar Entrada <BookOpen className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></>
              )}
            </button>
          </div>

          {/* RIGHT PAGE - Entries List */}
          <div className="flex-1 p-6 sm:p-10 md:p-12 relative bg-slate-50/50 md:pl-16 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h3 className="font-serif font-bold text-2xl text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-1" /> Mis Entradas
              </h3>
              
              {/* Toolbar */}
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-1/50 transition-shadow"
                  />
                </div>
                <button 
                  onClick={() => setFilterFavorite(!filterFavorite)}
                  className={`p-2 rounded-full border transition-colors flex shrink-0 items-center justify-center ${filterFavorite ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'}`}
                  title="Mostrar solo favoritos"
                >
                  <Star className={`w-4 h-4 ${filterFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar pb-4">
              <AnimatePresence>
                {filteredEntries.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-20 flex flex-col items-center"
                  >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                      <BookOpen className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="font-serif text-xl text-slate-600 mb-1">Tu diario está en blanco</p>
                    <p className="text-sm text-slate-400 max-w-xs">Cada palabra que escribas aquí será un testimonio de tu caminar.</p>
                  </motion.div>
                ) : (
                  filteredEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                            entry.type === 'reflexión' ? 'bg-amber-50 text-amber-600' :
                            entry.type === 'petición' ? 'bg-sky-50 text-sky-600' :
                            'bg-rose-50 text-rose-600'
                          }`}>
                            {entry.type === 'gratitud' && <Heart className="w-3 h-3" />}
                            {entry.type === 'petición' && <HandHeart className="w-3 h-3" />}
                            {entry.type === 'reflexión' && <BookOpen className="w-3 h-3" />}
                            {entry.type}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">{entry.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => toggleFavorite(entry.id)}
                            className={`p-1.5 rounded-full transition-colors ${entry.isFavorite ? 'text-amber-400 hover:bg-amber-50' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'}`}
                          >
                            <Star className={`w-4 h-4 ${entry.isFavorite ? 'fill-current' : ''}`} />
                          </button>
                          <button 
                            onClick={() => deleteEntry(entry.id)}
                            className="p-1.5 rounded-full text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium relative z-10">
                        {entry.text}
                      </p>
                      
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5 relative z-10">
                          {entry.tags.map(tagId => {
                            const t = customTags.find(c => c.id === tagId);
                            if (!t) return null;
                            return (
                              <span key={t.id} className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.color}`}>
                                {t.label}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Tag Management Modal */}
      <AnimatePresence>
        {showTagModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setShowTagModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-6">Tus Etiquetas</h3>
              
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  placeholder="Nueva etiqueta..."
                  value={newTagLabel}
                  onChange={(e) => setNewTagLabel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createCustomTag()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-1/40"
                  maxLength={15}
                />
                <button 
                  onClick={createCustomTag}
                  disabled={!newTagLabel.trim()}
                  className="bg-brand-1 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center gap-1 hover:bg-brand-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Crear
                </button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                {customTags.map(tag => (
                  <div key={tag.id} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${tag.color}`}>
                      {tag.label}
                    </span>
                    {!PREDEFINED_TAGS.find(t => t.id === tag.id) && (
                      <button 
                        onClick={() => deleteTag(tag.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
