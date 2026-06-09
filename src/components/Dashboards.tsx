import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Calendar, Bell, Search, MapPin, Heart, MessageCircle, 
  ChevronRight, Compass, ShieldAlert, ImagePlus, Send, Check, Trash2, Globe, Sparkles 
} from 'lucide-react';
import { 
  getLocalAnnouncements, saveLocalAnnouncements, addLocalAnnouncement, 
  getLocalChurches, addLocalChurch, saveLocalChurches, Announcement, Church 
} from '../data';
import { Journal } from './Journal';

export function UserDashboard({ user }: { user?: any }) {
  const [activeTab, setActiveTab] = useState<'descubrir' | 'comunidad' | 'diario'>('descubrir');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  const [linkedChurch, setLinkedChurch] = useState<string | null>(() => localStorage.getItem('belief-linked-church'));
  const [hasLinkedChurch, setHasLinkedChurch] = useState(() => localStorage.getItem('belief-has-linked-church') === 'true');
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingChurch, setInspectingChurch] = useState<Church | null>(null);

  useEffect(() => {
    setAnnouncements(getLocalAnnouncements());
    setChurches(getLocalChurches());
    setLinkedChurch(localStorage.getItem('belief-linked-church'));
    setHasLinkedChurch(localStorage.getItem('belief-has-linked-church') === 'true');
  }, [activeTab]);

  const handleLike = (id: string) => {
    const updated = announcements.map(ann => {
      if (ann.id === id) {
        const likedSymbol = `belief-liked-ann-${id}`;
        const alreadyLiked = localStorage.getItem(likedSymbol) === 'true';
        if (alreadyLiked) {
          localStorage.removeItem(likedSymbol);
          return { ...ann, likes: Math.max(0, ann.likes - 1) };
        } else {
          localStorage.setItem(likedSymbol, 'true');
          return { ...ann, likes: ann.likes + 1 };
        }
      }
      return ann;
    });
    setAnnouncements(updated);
    saveLocalAnnouncements(updated);
  };

  const isPostLiked = (id: string) => {
    return localStorage.getItem(`belief-liked-ann-${id}`) === 'true';
  };

  const handleAddComment = (postId: string) => {
    const text = newComment[postId]?.trim();
    if (!text) return;

    const loggedName = localStorage.getItem('belief-user-name') || user?.email?.split('@')[0] || 'Usuario Believe';
    const updated = announcements.map(ann => {
      if (ann.id === postId) {
        return {
          ...ann,
          comments: [
            ...(ann.comments || []),
            { author: loggedName, text, date: 'Hace un momento' }
          ]
        };
      }
      return ann;
    });

    setAnnouncements(updated);
    saveLocalAnnouncements(updated);
    setNewComment(prev => ({ ...prev, [postId]: '' }));
  };

  const handleJoinChurch = (churchName: string) => {
    localStorage.setItem('belief-linked-church', churchName);
    localStorage.setItem('belief-has-linked-church', 'true');
    setLinkedChurch(churchName);
    setHasLinkedChurch(true);
  };

  const handleLeaveChurch = () => {
    localStorage.removeItem('belief-linked-church');
    localStorage.setItem('belief-has-linked-church', 'false');
    setLinkedChurch(null);
    setHasLinkedChurch(false);
  };

  // Filter global posts
  const globalAnnouncements = announcements.filter(a => a.category === 'global');
  
  // Filter local posts of current church
  const localAnnouncements = announcements.filter(a => a.category === 'local' && a.churchName === linkedChurch);

  return (
    <div className="min-h-screen pt-32 px-4 pb-24 text-belief-white">
      <div className="max-w-6xl mx-auto">
        {/* Tab Selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-10">
          <div className="glass-panel p-1 inline-flex rounded-full border border-theme-border">
            <button
              onClick={() => setActiveTab('descubrir')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'descubrir' ? 'bg-brand-1 text-white' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <span className="flex items-center gap-2"><Compass className="w-4 h-4" /> Descubrir</span>
            </button>
            <button
              onClick={() => setActiveTab('comunidad')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === 'comunidad' ? 'bg-brand-1 text-white' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Mi Comunidad</span>
            </button>
            <button
              onClick={() => setActiveTab('diario')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === 'diario' ? 'bg-brand-1 text-white' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> Mi Diario</span>
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'descubrir' && (
            <motion.div key="descubrir" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              
              {/* Dynamic Global / Admin Announcements */}
              <div className="space-y-6 mb-8">
                {globalAnnouncements.length > 0 ? (
                  globalAnnouncements.map((ann) => (
                    <motion.div key={ann.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 rounded-3xl border-l-4 border-l-brand-3 relative overflow-hidden bg-gradient-to-r from-brand-3/5 to-transparent border border-theme-border">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-3 flex items-center justify-center text-black font-bold text-xs uppercase">
                            G
                          </div>
                          <div>
                            <h3 className="font-sans font-bold text-sm text-brand-3">{ann.author}</h3>
                            <p className="text-[10px] opacity-50 uppercase tracking-widest">Boletín Oficial • {ann.date}</p>
                          </div>
                        </div>
                        <span className="bg-brand-3/20 text-brand-3 px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold">Global</span>
                      </div>
                      <h2 className="font-serif text-2xl mb-3 font-semibold text-brand-4">{ann.title}</h2>
                      <p className="font-sans text-sm opacity-80 mb-6 font-light leading-relaxed max-w-3xl whitespace-pre-line">
                        {ann.content}
                      </p>
                      
                      {/* Likes & Comments inside Global */}
                      <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-6">
                          <button 
                            onClick={() => handleLike(ann.id)} 
                            className={`flex items-center gap-2 text-xs font-bold uppercase transition-colors cursor-pointer ${isPostLiked(ann.id) ? 'text-brand-3' : 'opacity-60 hover:opacity-100'}`}
                          >
                            <Heart className={`w-4 h-4 ${isPostLiked(ann.id) ? 'fill-current' : ''}`} /> {ann.likes} Likes
                          </button>
                        </div>

                        {/* Custom Comments list for global */}
                        <div className="space-y-3 mt-2">
                          {ann.comments && ann.comments.map((comm, idx) => (
                            <div key={idx} className="flex gap-2.5 bg-white/5 p-3 rounded-2xl text-xs max-w-xl font-light">
                              <span className="font-bold text-brand-3">{comm.author}:</span>
                              <span>{comm.text}</span>
                            </div>
                          ))}
                          
                          <div className="relative max-w-xl flex gap-2">
                            <input 
                              type="text" 
                              value={newComment[ann.id] || ''}
                              onChange={(e) => setNewComment(prev => ({ ...prev, [ann.id]: e.target.value }))}
                              placeholder="Escribe un comentario o amén de apoyo..."
                              className="w-full bg-black/30 border border-white/10 rounded-full py-2 px-4 text-xs focus:outline-none focus:border-brand-3" 
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(ann.id)}
                            />
                            <button 
                              onClick={() => handleAddComment(ann.id)}
                              className="px-4 py-2 bg-brand-3 text-black font-bold text-xs rounded-full hover:bg-brand-4"
                            >
                              Enviar
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="glass-panel p-8 rounded-3xl text-center border border-theme-border opacity-70 mb-4">
                    <p className="font-serif text-lg">No hay comunicados globales activos en este momento.</p>
                  </div>
                )}
              </div>

              {/* Word of the Day Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="md:col-span-2 glass-panel p-8 rounded-3xl border-l-4 border-brand-2 relative overflow-hidden border border-theme-border">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-2/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                  <h3 className="text-xs uppercase tracking-widest opacity-60 mb-2 font-sans font-bold text-brand-2">Palabra de Hoy</h3>
                  <h2 className="font-serif text-3xl mb-4 italic">"Por tanto, os digo que todo lo que pidiereis orando, creed que lo recibiréis..."</h2>
                  <p className="font-sans text-sm opacity-80 mb-6 font-light">Marcos 11:24</p>
                  <div className="text-xs opacity-70 leading-relaxed font-sans max-w-xl mb-4">
                     La oración activa no es un deseo estático; es la convicción profunda de que Dios atiende con amor y obrará conforme a su perfecta voluntad en el momento propicio.
                  </div>
                </div>

                {/* Quick Link/Search Widget */}
                <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between border border-theme-border bg-gradient-to-br from-brand-1/5 to-transparent">
                  <div>
                    <h3 className="font-sans text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Search className="w-4 h-4 text-brand-1" /> Busca tu Iglesia
                    </h3>
                    <p className="text-xs opacity-60 mb-4 leading-relaxed">
                      Conéctate con tu congregación local para ver sus anuncios, boletines y eventos pastorales exclusivos.
                    </p>
                  </div>
                  {linkedChurch ? (
                    <div className="bg-brand-1/10 p-4 rounded-2xl border border-brand-1/20 text-xs">
                      <p className="opacity-60 uppercase font-bold tracking-wider text-[9px] mb-1">Vinculado actualmente a:</p>
                      <p className="font-bold text-brand-1 text-sm">{linkedChurch}</p>
                      <button onClick={handleLeaveChurch} className="mt-3 text-[10px] uppercase tracking-wider font-bold text-brand-2 hover:underline">Vincular otra</button>
                    </div>
                  ) : (
                    <div className="bg-black/10 p-3 rounded-2xl text-xs opacity-80 border border-white/5 text-center">
                      <p className="mb-2.5 font-sans">No tienes ninguna iglesia vinculada.</p>
                      <button onClick={() => setActiveTab('comunidad')} className="text-brand-1 font-bold uppercase tracking-wider hover:underline text-[10px]">Buscar Ahora</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Suggestions / Nearby Info */}
              <div className="mb-12">
                <h3 className="font-serif text-2xl mb-6 font-semibold">Iglesias sugeridas en la red</h3>
                {churches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {churches.slice(0, 3).map((church) => (
                      <div key={church.id} className="glass-panel rounded-2xl overflow-hidden group border border-theme-border hover:border-brand-1/40 transition-all flex flex-col justify-between">
                        <div>
                          <div className="h-28 bg-brand-1/10 relative flex items-center justify-center border-b border-theme-border/50 overflow-hidden">
                            {church.logo ? (
                              <img src={church.logo} alt={church.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <MapPin className="w-8 h-8 text-brand-1/40 group-hover:text-brand-1/80 transition-colors" />
                            )}
                          </div>
                          <div className="p-5">
                            <h4 className="font-bold mb-1 text-belief-white truncate">{church.name}</h4>
                            <p className="text-xs opacity-60 flex items-center gap-1"><MapPin className="w-3 h-3" /> {church.loc}</p>
                            <p className="text-[10px] opacity-40 mt-1">{church.members} miembros registrados</p>
                          </div>
                        </div>
                        <div className="p-5 pt-0 flex gap-2">
                          <button 
                            onClick={() => setInspectingChurch(church)}
                            className="flex-1 text-[10px] uppercase tracking-wider bg-white/5 hover:bg-white/10 text-belief-white py-2 rounded-xl border border-white/10 font-bold transition-all cursor-pointer text-center"
                          >
                            Ver Perfil
                          </button>
                          <button 
                            onClick={() => handleJoinChurch(church.name)}
                            className="flex-1 text-[10px] uppercase tracking-wider bg-brand-1/10 hover:bg-brand-1 text-belief-white py-2 rounded-xl border border-white/10 font-bold transition-all cursor-pointer text-center"
                          >
                            Vincularme
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel p-6 rounded-3xl text-center opacity-70 max-w-xl border border-theme-border">
                    <p className="font-sans text-xs">No hay iglesias registradas en la plataforma todavía. El Súper Admin principal puede agregar congregaciones desde su panel.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'comunidad' && (
            <motion.div key="comunidad" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {!hasLinkedChurch || !linkedChurch ? (
                 <div className="glass-panel p-12 rounded-3xl text-center max-w-2xl mx-auto border border-theme-border">
                   <div className="w-20 h-20 bg-brand-1/20 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Users className="w-10 h-10 text-brand-1" />
                   </div>
                   <h2 className="font-serif text-3xl mb-4 font-bold uppercase tracking-wide text-brand-1">Aún no estás en una comunidad</h2>
                   <p className="font-sans text-sm opacity-70 mb-8 max-w-md mx-auto">
                     Para ver los boletines locales, anuncios y eventos de tu pastor y lideres, vincula tu iglesia participante.
                   </p>
                   
                   {churches.length > 0 ? (
                     <div className="space-y-3 max-w-md mx-auto">
                       <p className="text-xs uppercase tracking-wider opacity-60 font-bold">Selecciona una de las Iglesias Reales Registradas:</p>
                       <div className="grid grid-cols-1 gap-2.5">
                         {churches.map((c) => (
                           <div 
                             key={c.id}
                             className="p-3 bg-white/5 border border-theme-border hover:bg-white/10 rounded-xl text-xs font-sans flex justify-between items-center transition-all"
                           >
                             <div className="text-left">
                               <p className="font-bold text-belief-white">{c.name}</p>
                               <span className="opacity-60 text-[10px]">{c.loc}</span>
                             </div>
                             <div className="flex gap-2">
                               <button 
                                 type="button"
                                 onClick={() => setInspectingChurch(c)}
                                 className="px-2.5 py-1.5 bg-white/10 hover:bg-white/25 text-belief-white font-bold rounded-lg text-[10px] uppercase cursor-pointer"
                               >
                                 Ver Perfil
                               </button>
                               <button 
                                 type="button"
                                 onClick={() => handleJoinChurch(c.name)}
                                 className="px-2.5 py-1.5 bg-brand-1 hover:bg-brand-2 text-white font-bold rounded-lg text-[10px] uppercase cursor-pointer"
                               >
                                 Vincular
                               </button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   ) : (
                     <div className="text-xs opacity-60 bg-black/25 p-4 rounded-xl max-w-md mx-auto">
                       <p>Actualmente no hay iglesias registradas en la base de datos local. Por favor, asegúrate de ingresar como Súper Admin para registrar una.</p>
                     </div>
                   )}
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Local Feed */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-brand-1/5 p-4 rounded-2xl border border-brand-1/20 flex justify-between items-center flex-wrap gap-2">
                      <div className="text-xs">
                        <span className="opacity-60">Perteneces a la comunidad: </span>
                        <strong className="text-brand-1 font-serif text-sm ml-1">{linkedChurch}</strong>
                      </div>
                      <button onClick={handleLeaveChurch} className="text-[10px] uppercase tracking-wider font-bold text-brand-2 hover:underline">Cambiar de Iglesia</button>
                    </div>

                    {localAnnouncements.length > 0 ? (
                      localAnnouncements.map((ann) => (
                        <div key={ann.id} className="glass-panel p-8 rounded-3xl border border-theme-border relative">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-brand-1/30 flex items-center justify-center text-brand-1 font-serif text-xl border border-brand-1/50 font-bold">
                               {ann.author?.[0]?.toUpperCase() || 'P'}
                            </div>
                            <div>
                              <h3 className="font-sans font-bold text-sm text-belief-white">{ann.author}</h3>
                              <p className="text-[10px] opacity-40 uppercase tracking-widest">{ann.date} • Local</p>
                            </div>
                          </div>
                          
                          <h2 className="font-serif text-2xl mb-4 text-brand-1 font-semibold">{ann.title}</h2>
                          <p className="font-sans text-sm opacity-80 leading-relaxed font-light mb-6 whitespace-pre-line">
                            {ann.content}
                          </p>

                          {/* Likes / Comments Loop */}
                          <div className="flex flex-col gap-4 pt-4 border-t border-white/15">
                            <div className="flex items-center gap-6">
                              <button 
                                onClick={() => handleLike(ann.id)} 
                                className={`flex items-center gap-2 text-xs font-bold uppercase transition-colors cursor-pointer ${isPostLiked(ann.id) ? 'text-brand-3' : 'opacity-60 hover:opacity-100'}`}
                              >
                                <Heart className={`w-4 h-4 ${isPostLiked(ann.id) ? 'fill-current' : ''}`} /> {ann.likes} Likes
                              </button>
                            </div>

                            {/* Comments block */}
                            <div className="space-y-3 mt-2">
                              {ann.comments && ann.comments.map((comm, idx) => (
                                <div key={idx} className="flex gap-2.5 bg-white/5 p-3 rounded-2xl text-xs max-w-xl font-light border border-white/5">
                                  <span className="font-bold text-brand-2">{comm.author}:</span>
                                  <span className="text-zinc-200">{comm.text}</span>
                                </div>
                              ))}
                              
                              <div className="relative max-w-xl flex gap-2 pt-2">
                                <input 
                                  type="text" 
                                  value={newComment[ann.id] || ''}
                                  onChange={(e) => setNewComment(prev => ({ ...prev, [ann.id]: e.target.value }))}
                                  placeholder="Escribe un mensaje de apoyo o amén..."
                                  className="w-full bg-black/40 border border-white/10 rounded-full py-2 px-4 text-xs focus:outline-none focus:border-brand-1 transition-colors" 
                                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(ann.id)}
                                />
                                <button 
                                  onClick={() => handleAddComment(ann.id)}
                                  className="px-4 py-2 bg-brand-1 text-white font-bold text-xs rounded-full hover:bg-brand-2"
                                >
                                  Enviar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="glass-panel p-10 rounded-3xl text-center border border-theme-border text-zinc-400">
                        <p className="font-serif text-lg mb-2">No hay mensajes específicos creados para esta congregación todavía.</p>
                        <p className="text-xs opacity-60">Los administradores locales cargan recursos y eventos aquí.</p>
                      </div>
                    )}
                  </div>

                  {/* Sidebar stats/info */}
                  <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-6 rounded-3xl border border-theme-border">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <Bell className="w-5 h-5 text-brand-4" />
                          <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-brand-4">Avisos Locales</h3>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="border-b border-white/10 pb-4">
                          <p className="font-sans text-xs mb-1 text-brand-2 font-medium">Campaña de abrigos de invierno</p>
                          <span className="text-[10px] opacity-50 flex items-center gap-1"><Calendar className="w-3 h-3"/> Hasta el 30 de Nov.</span>
                        </div>
                        <div className="border-b border-white/10 pb-4">
                          <p className="font-sans text-xs mb-1 text-brand-2 font-medium">Ensayo general coro de Navidad</p>
                          <span className="text-[10px] opacity-50 flex items-center gap-1"><Calendar className="w-3 h-3"/> Jueves 19:00</span>
                        </div>
                        <div>
                          <p className="font-sans text-xs mb-1 text-brand-2 font-medium">Estudio Bíblico General</p>
                          <span className="text-[10px] opacity-50 flex items-center gap-1"><Calendar className="w-3 h-3"/> Próxima semana</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'diario' && (
            <motion.div key="diario" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="-mt-24">
                <Journal />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Church Profile Inspection Modal */}
        <AnimatePresence>
          {inspectingChurch && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.9, y: 20 }} 
                className="glass-panel overflow-hidden max-w-2xl w-full rounded-3xl border border-theme-border relative max-h-[90vh] overflow-y-auto"
              >
                {/* Header Close button */}
                <button 
                  onClick={() => setInspectingChurch(null)}
                  className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 cursor-pointer transition-colors"
                >
                  <span className="sr-only">Cerrar</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Banner image/logo */}
                <div className="h-56 relative bg-gradient-to-tr from-brand-1/30 to-brand-2/10 flex items-center justify-center text-center overflow-hidden border-b border-theme-border">
                  {inspectingChurch.logo ? (
                    <img src={inspectingChurch.logo} alt={inspectingChurch.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-6">
                      <MapPin className="w-16 h-16 text-brand-1/40 animate-pulse" />
                      <span className="text-[11px] uppercase tracking-widest text-brand-2 bg-brand-2/10 px-3 py-1 rounded-full font-bold">Unida virtualmente</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 text-left flex flex-col justify-end pt-16">
                    <h3 className="font-serif text-3xl font-bold text-white tracking-wide">{inspectingChurch.name}</h3>
                    <p className="text-xs text-brand-2 font-medium flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {inspectingChurch.address} ({inspectingChurch.loc})
                    </p>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-8 space-y-6">
                  {/* Mission & Vision */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
                      <div className="absolute top-2 right-2 opacity-10 text-3xl font-serif text-brand-2">M</div>
                      <h4 className="font-serif text-sm font-bold text-brand-2 uppercase tracking-wider mb-2">Nuestra Misión</h4>
                      <p className="font-sans text-xs opacity-80 leading-relaxed font-light whitespace-pre-line italic text-zinc-100">
                        {inspectingChurch.mission || "Llevar la palabra de vida para conectar corazones y propósito, amparando espiritualmente bajo la fe y promoviendo el servicio social mutuo."}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
                      <div className="absolute top-2 right-2 opacity-10 text-3xl font-serif text-brand-1">V</div>
                      <h4 className="font-serif text-sm font-bold text-brand-1 uppercase tracking-wider mb-2">Nuestra Visión</h4>
                      <p className="font-sans text-xs opacity-80 leading-relaxed font-light whitespace-pre-line italic text-zinc-100">
                        {inspectingChurch.vision || "Ser un faro de esperanza mundial y un puente interactivo capaz de proveer sanidad integral a las familias apoyándonos en la red divina."}
                      </p>
                    </div>
                  </div>

                  {/* General Stats */}
                  <div className="flex justify-between items-center bg-black/25 p-4 rounded-xl text-xs border border-white/5">
                    <div className="text-center flex-1">
                      <span className="block opacity-50 uppercase text-[9px] tracking-widest">Miembros</span>
                      <span className="font-bold text-brand-3 text-lg font-serif">{inspectingChurch.members}</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="text-center flex-1">
                      <span className="block opacity-50 uppercase text-[9px] tracking-widest">Estado</span>
                      <span className="font-bold text-brand-5 text-lg font-serif">Activa</span>
                    </div>
                  </div>

                  {/* Join / Bind action */}
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        handleJoinChurch(inspectingChurch.name);
                        setInspectingChurch(null);
                      }}
                      className="flex-1 bg-brand-1 hover:bg-brand-2 text-white font-bold py-3 px-6 rounded-full text-xs uppercase tracking-widest transition-all shadow-lg text-center cursor-pointer"
                    >
                      {linkedChurch === inspectingChurch.name ? "Ya estás vinculado" : "Vincular a mi Perfil"}
                    </button>
                    <button 
                      onClick={() => setInspectingChurch(null)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 font-bold py-3 px-6 rounded-full text-xs uppercase tracking-widest transition-all text-center cursor-pointer"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function AdminDashboard({ user }: { user?: any }) {
  const userPendingKey = 'belief-pastor-pending-' + (user?.email || 'default');
  const userApprovedKey = 'belief-pastor-approved-' + (user?.email || 'default');
  
  const [isPending, setIsPending] = useState(() => localStorage.getItem(userPendingKey) === 'true');
  const [isApproved, setIsApproved] = useState(() => localStorage.getItem('belief-linked-church') || localStorage.getItem(userApprovedKey));
  
  const [regName, setRegName] = useState('');
  const [regLoc, setRegLoc] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regLogo, setRegLogo] = useState('');
  const [regMission, setRegMission] = useState('');
  const [regVision, setRegVision] = useState('');
  const [regPastors, setRegPastors] = useState('');
  
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setRegLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submitChurchRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regLoc.trim() || !regAddress.trim() || !regMission.trim() || !regVision.trim()) return;

    const pendingListRaw = localStorage.getItem('belief-pending-churches');
    const pendingList = pendingListRaw ? JSON.parse(pendingListRaw) : [];
    
    pendingList.push({
      id: 'pend_' + Date.now(),
      name: regName,
      email: user?.email || '',
      loc: regLoc,
      address: regAddress,
      logo: regLogo || undefined,
      mission: regMission.trim(),
      vision: regVision.trim(),
      pastors: regPastors.trim() || user?.email || 'Pastor General'
    });
    
    localStorage.setItem('belief-pending-churches', JSON.stringify(pendingList));
    localStorage.setItem(userPendingKey, 'true');
    setIsPending(true);
  };

  const [showEventForm, setShowEventForm] = useState(false);
  const [localChurchName, setLocalChurchName] = useState(() => localStorage.getItem('belief-linked-church') || 'Centro Cristiano Vida');
  const [pushedOk, setPushedOk] = useState(false);

  // Form Fields
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postAuthor, setPostAuthor] = useState('Pastor de la Comunidad');

  // Stats
  const [localMembersCount, setLocalMembersCount] = useState(1245);
  const [prayersCount, setPrayersCount] = useState(89);

  const handlePostLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    addLocalAnnouncement({
      title: postTitle,
      content: postContent,
      category: 'local',
      churchName: isApproved || localChurchName,
      author: postAuthor,
      date: 'Hace un momento'
    });

    setPostTitle('');
    setPostContent('');
    setPushedOk(true);
    setTimeout(() => {
      setPushedOk(false);
      setShowEventForm(false);
    }, 2500);
  };

  if (!isApproved && !isPending) {
    return (
      <div className="min-h-screen pt-32 px-4 pb-24 text-belief-white flex justify-center">
        <div className="max-w-3xl w-full glass-panel p-8 rounded-3xl border-l-4 border-l-brand-2 border border-theme-border">
          <h2 className="font-serif text-3xl mb-2 text-brand-2 font-bold uppercase tracking-wide">Crea tu Comunidad</h2>
          <p className="font-sans text-sm opacity-70 mb-8">Por favor, registra los datos de tu congregación para que sean evaluados por la administración.</p>
          
          <form onSubmit={submitChurchRegistration} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Nombre de la Iglesia *</label>
                <input required type="text" value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-2 text-white" placeholder="Ej: Iglesia Vida Nueva" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Ciudad / País *</label>
                <input required type="text" value={regLoc} onChange={(e) => setRegLoc(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-2 text-white" placeholder="Ej: Madrid, ES" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Dirección Completa *</label>
                <input required type="text" value={regAddress} onChange={(e) => setRegAddress(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-2 text-white" placeholder="Ej: Calle Gran Vía 12" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Pastores / Líderes Principales *</label>
                <input required type="text" value={regPastors} onChange={(e) => setRegPastors(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-2 text-white" placeholder="Ej: Ps. Juan y María" />
              </div>
            </div>

            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
              <label className="block text-xs uppercase tracking-widest opacity-60 mb-3 font-bold">Logo o Foto de Portada (Opcional)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-brand-1/25 hover:bg-brand-1 text-belief-white px-4 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 py-2">
                      <ImagePlus className="w-3.5 h-3.5" /> Subir archivo de imagen
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                  </div>
                </div>
                {regLogo && (
                  <div className="w-full h-24 rounded-xl border border-white/10 overflow-hidden">
                    <img src={regLogo} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold text-brand-2">Misión *</label>
                <textarea required rows={3} value={regMission} onChange={(e) => setRegMission(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-brand-2 text-white resize-none" placeholder="Propósito central..." />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold text-brand-1">Visión *</label>
                <textarea required rows={3} value={regVision} onChange={(e) => setRegVision(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-brand-2 text-white resize-none" placeholder="Visión a futuro..." />
              </div>
            </div>

            <button type="submit" className="w-full bg-brand-2 hover:bg-brand-3 text-stone-900 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all cursor-pointer shadow-lg shadow-brand-2/15">
              Enviar Solicitud de Registro
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isPending && !isApproved) {
    return (
      <div className="min-h-screen pt-32 px-4 pb-24 text-belief-white flex justify-center text-center">
        <div className="max-w-xl w-full glass-panel p-10 rounded-3xl border-l-4 border-l-brand-1 border border-theme-border">
          <h2 className="font-serif text-3xl mb-4 text-brand-1 font-bold uppercase tracking-wide">Solicitud en Proceso</h2>
          <p className="font-sans text-sm opacity-80 mb-6 font-light">Tu congregación está siendo evaluada por la administración. Te notificaremos una vez que sea aprobada y conectada al Directorio Global de Believe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 pb-24 text-belief-white">
      <div className="max-w-6xl mx-auto">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 border-b border-theme-border pb-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-brand-3 mb-2 font-bold uppercase tracking-wide">Panel de Administración Local</h1>
            <p className="font-sans font-light opacity-70">
              Congregación actual: <strong className="text-brand-1">{localChurchName}</strong>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setShowEventForm(!showEventForm)} className="bg-brand-1 hover:bg-brand-2 text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer">
              {showEventForm ? 'Cancelar' : 'Nuevo Evento / Boletín'}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showEventForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
              <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-brand-1 border border-theme-border">
                <h3 className="font-serif text-2xl mb-6 text-brand-1 font-semibold">Crear Evento o Boletín Local</h3>
                
                {pushedOk ? (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-2 mb-4 font-bold text-xs uppercase tracking-wide">
                    <Check className="w-5 h-5" /> ¡Anuncio / Boletín local publicado con éxito! Sincronizado en el Feed de la comunidad.
                  </div>
                ) : null}

                <form onSubmit={handlePostLocalSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Título del Anuncio</label>
                    <input 
                      required
                      type="text" 
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-1 text-white" 
                      placeholder="Ej: Gran Campaña de Solidaridad de Invierno"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Autor / Firma</label>
                      <input 
                        required
                        type="text" 
                        value={postAuthor}
                        onChange={(e) => setPostAuthor(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-1 text-white" 
                        placeholder="Ej: Pastor Carlos Mendoza / Liderazgo"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Congregación Designada</label>
                      <input 
                        disabled
                        type="text" 
                        value={localChurchName}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-stone-400 cursor-not-allowed" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Descripción y Cuerpo del Mensaje</label>
                    <textarea 
                      required
                      rows={4} 
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-1 resize-none text-white font-sans" 
                      placeholder="Escribe el mensaje motivacional, pasaje o aviso..."
                    />
                  </div>
                  <div className="flex gap-4 items-center">
                    <button type="submit" className="bg-brand-1 hover:bg-brand-2 text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-brand-1/25">
                      <Send className="w-4 h-4" /> Publicar Boletín Local
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
           <div className="glass-panel p-6 rounded-2xl border border-theme-border">
             <h4 className="text-xs uppercase tracking-widest opacity-60 mb-2 font-sans text-brand-1">Miembros Oficiales</h4>
             <div className="text-3xl font-serif text-brand-4 font-bold">{localMembersCount}</div>
             <p className="text-[10px] text-brand-5 mt-2">+12 esta semana</p>
           </div>
           <div className="glass-panel p-6 rounded-2xl border border-theme-border">
             <h4 className="text-xs uppercase tracking-widest opacity-60 mb-2 font-sans text-brand-1">Grupos de Estudio</h4>
             <div className="text-3xl font-serif text-brand-3 font-bold">24</div>
             <p className="text-[10px] opacity-50 mt-2">Activos en red</p>
           </div>
           <div className="glass-panel p-6 rounded-2xl border border-theme-border">
             <h4 className="text-xs uppercase tracking-widest opacity-60 mb-2 font-sans text-brand-1">Peticiones de Oración</h4>
             <div className="text-3xl font-serif text-brand-2 font-bold">{prayersCount}</div>
           </div>
           <div className="glass-panel p-6 rounded-2xl border border-theme-border">
             <h4 className="text-xs uppercase tracking-widest opacity-60 mb-2 font-sans text-brand-1">Asistencia</h4>
             <div className="text-3xl font-serif text-brand-5 font-bold">85%</div>
             <p className="text-[10px] opacity-50 mt-2">Promedio de servicios</p>
           </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-theme-border">
          <h3 className="font-serif text-xl mb-6 text-brand-3 font-bold uppercase tracking-wide">Registro de Actividad de la Comunidad</h3>
          <div className="space-y-4 font-sans font-light text-sm">
             <div className="flex justify-between items-center py-3 border-b border-white/5">
               <span className="opacity-80">Nuevo hermano registrado en la plataforma hoy vinculándose a tu iglesia.</span>
               <span className="opacity-50 text-xs">Hace 5 min</span>
             </div>
             <div className="flex justify-between items-center py-3 border-b border-white/5">
               <span className="opacity-80">Pastor {user?.email || 'Principal'} editó detalles de ubicación de oficina.</span>
               <span className="opacity-50 text-xs">Hace 2 horas</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SuperAdminDashboard() {
  const [showGlobalPost, setShowGlobalPost] = useState(false);
  const [showRegisterChurchForm, setShowRegisterChurchForm] = useState(false);

  // Súper Admin Form states
  const [globalTitle, setGlobalTitle] = useState('');
  const [globalContent, setGlobalContent] = useState('');
  const [globalSuccess, setGlobalSuccess] = useState(false);

  // Register Church state inputs
  const [regName, setRegName] = useState('');
  const [regLoc, setRegLoc] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regMembers, setRegMembers] = useState(100);
  const [regLogo, setRegLogo] = useState('');
  const [regMission, setRegMission] = useState('');
  const [regVision, setRegVision] = useState('');
  const [churchSuccess, setChurchSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic statistics
  const [totalChurchesCount, setTotalChurchesCount] = useState(() => getLocalChurches().length);
  const [usersCount, setUsersCount] = useState(() => {
    const saved = localStorage.getItem('belief-stats-users-count');
    return saved ? Number(saved) : 15420;
  });
  const [revenue, setRevenue] = useState(() => {
    const saved = localStorage.getItem('belief-stats-revenue');
    return saved ? Number(saved) : 12450;
  });

  // Dynamic Pending Requests list
  const [pendingChurches, setPendingChurches] = useState<{id: string, name: string, email: string, loc: string, address: string, logo?: string, mission?: string, vision?: string, pastors?: string}[]>(() => {
    const saved = localStorage.getItem('belief-pending-churches');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [registeredChurchesList, setRegisteredChurchesList] = useState<Church[]>(() => getLocalChurches());

  useEffect(() => {
    localStorage.setItem('belief-stats-users-count', String(usersCount));
  }, [usersCount]);

  useEffect(() => {
    localStorage.setItem('belief-stats-revenue', String(revenue));
  }, [revenue]);

  useEffect(() => {
    localStorage.setItem('belief-pending-churches', JSON.stringify(pendingChurches));
  }, [pendingChurches]);

  const handlePostGlobalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalTitle.trim() || !globalContent.trim()) return;

    addLocalAnnouncement({
      title: globalTitle,
      content: globalContent,
      category: 'global',
      author: 'Administración Global',
      date: 'Hace un momento'
    });

    setGlobalTitle('');
    setGlobalContent('');
    setGlobalSuccess(true);
    setTimeout(() => {
      setGlobalSuccess(false);
      setShowGlobalPost(false);
    }, 2500);
  };

  const handleRegisterChurchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regLoc.trim() || !regAddress.trim()) return;

    const registered = addLocalChurch({
      name: regName,
      loc: regLoc,
      address: regAddress,
      members: regMembers,
      logo: regLogo || undefined,
      mission: regMission.trim() || undefined,
      vision: regVision.trim() || undefined
    });

    setRegisteredChurchesList(getLocalChurches());
    setTotalChurchesCount(getLocalChurches().length);

    setRegName('');
    setRegLoc('');
    setRegAddress('');
    setRegMembers(100);
    setRegLogo('');
    setRegMission('');
    setRegVision('');
    setChurchSuccess(true);
    setTimeout(() => {
      setChurchSuccess(false);
      setShowRegisterChurchForm(false);
    }, 2500);
  };

  const handleApprovePending = (church: typeof pendingChurches[0]) => {
    // 1. Move to real churches list
    addLocalChurch({
      name: church.name,
      loc: church.loc,
      address: church.address,
      members: 150,
      logo: church.logo,
      mission: church.mission || 'Nuestra misión es llevar la palabra generadora de vida...',
      vision: church.vision || 'Visualizamos una comunidad unida y fortalecida...',
      pastors: church.pastors || church.email
    });
    
    // Notify the user on next login
    localStorage.setItem('belief-pastor-approved-' + church.email, church.name);
    localStorage.removeItem('belief-pastor-pending-' + church.email);

    // 2. Remove from pending list
    const updatedPending = pendingChurches.filter(p => p.id !== church.id);
    setPendingChurches(updatedPending);

    // 3. Increment counters
    setTotalChurchesCount(getLocalChurches().length);
    setRegisteredChurchesList(getLocalChurches());
    setRevenue(prev => prev + 150); // Simulating addition to revenue streams
  };

  const handleRejectPending = (id: string, email: string) => {
    const updatedPending = pendingChurches.filter(p => p.id !== id);
    setPendingChurches(updatedPending);
    localStorage.removeItem('belief-pastor-pending-' + email);
  };

  const handleDeleteChurch = (id: string) => {
    const currentList = getLocalChurches();
    const updated = currentList.filter(c => c.id !== id);
    saveLocalChurches(updated);
    setRegisteredChurchesList(updated);
    setTotalChurchesCount(updated.length);
  };

  return (
    <div className="min-h-screen pt-32 px-4 pb-24 text-belief-white">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 border-b border-theme-border pb-6">
          <div>
            <span className="bg-brand-3/20 text-brand-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold inline-block mb-2">Panel Autoritativo</span>
            <h1 className="font-serif text-3xl md:text-4xl text-brand-3 font-bold uppercase tracking-wide">Consola de Creador</h1>
            <p className="font-sans font-light opacity-70">Control total del ecosistema de fe global</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => {
                setShowRegisterChurchForm(!showRegisterChurchForm);
                setShowGlobalPost(false);
              }} 
              className="glass-panel px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:border-brand-2 transition-colors cursor-pointer border border-theme-border"
            >
              {showRegisterChurchForm ? 'Cancelar' : 'Registrar Iglesia'}
            </button>
            <button 
              onClick={() => {
                setShowGlobalPost(!showGlobalPost);
                setShowRegisterChurchForm(false);
              }} 
              className="bg-brand-1 hover:bg-brand-2 text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer"
            >
              {showGlobalPost ? 'Cancelar' : 'Anuncio Global'}
            </button>
          </div>
        </motion.div>

        {/* Global Announcement Post form */}
        <AnimatePresence>
          {showGlobalPost && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
              <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-brand-3 border border-theme-border">
                <h3 className="font-serif text-2xl mb-6 text-brand-3 flex items-center gap-2 font-bold uppercase tracking-wide">Publicar en todos los Feeds (Comunicado Global)</h3>
                
                {globalSuccess && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-2 mb-4 font-bold text-xs uppercase tracking-wide">
                    <Check className="w-5 h-5 animate-pulse" /> ¡Su boletín global ha sido publicado con éxito y se encuentra sincronizado en tiempo real!
                  </div>
                )}

                <form onSubmit={handlePostGlobalSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Título del Anuncio Global</label>
                    <input 
                      required
                      type="text" 
                      value={globalTitle}
                      onChange={(e) => setGlobalTitle(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-3 text-white" 
                      placeholder="Ej: Mensaje Pastoral Conjunto: Bienvenida Oficial 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Cuerpo Oficial del Mensaje</label>
                    <textarea 
                      required
                      rows={5} 
                      value={globalContent}
                      onChange={(e) => setGlobalContent(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-3 resize-none text-white font-sans whitespace-pre-line" 
                      placeholder="Escribe el boletín fidedigno de alcance global..."
                    />
                  </div>
                  <div className="flex gap-4 items-center">
                    <button type="submit" className="bg-brand-3 hover:bg-brand-4 text-black px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-colors flex items-center gap-2 shadow-lg shadow-brand-3/20">
                      <Send className="w-4 h-4" /> Publicar Oficialmente
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Register Church form */}
        <AnimatePresence>
          {showRegisterChurchForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
              <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-brand-2 border border-theme-border">
                <h3 className="font-serif text-2xl mb-6 text-brand-2 flex items-center gap-2 font-bold uppercase tracking-wide">Alta Oficial de Congregación Activa</h3>
                
                {churchSuccess && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-2 mb-4 font-bold text-xs uppercase tracking-wide">
                    <Check className="w-5 h-5" /> ¡Iglesia participante dada de alta e integrada en el mapa con éxito!
                  </div>
                )}

                <form onSubmit={handleRegisterChurchSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Nombre de la Iglesia</label>
                      <input 
                        required
                        type="text" 
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-2 text-white" 
                        placeholder="Ej: Iglesia Vida Nueva"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Ciudad / País</label>
                      <input 
                        required
                        type="text" 
                        value={regLoc}
                        onChange={(e) => setRegLoc(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-2 text-white" 
                        placeholder="Ej: Madrid, ES"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Dirección Completa</label>
                      <input 
                        required
                        type="text" 
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-2 text-white" 
                        placeholder="Ej: Calle Gran Vía 12, Centro"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Miembros Sugeridos</label>
                      <input 
                        required
                        type="number" 
                        value={regMembers}
                        onChange={(e) => setRegMembers(Number(e.target.value))}
                        className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-2 text-white" 
                      />
                    </div>
                  </div>

                  {/* LOGO AND PHOTO UPLOADER */}
                  <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-3 font-bold">Logo o Foto de Portada</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="md:col-span-2 flex flex-col gap-2">
                        <input 
                          type="text" 
                          value={regLogo}
                          onChange={(e) => setRegLogo(e.target.value)}
                          placeholder="Pega la URL del logo/foto de portada o súbela como archivo" 
                          className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-brand-2 text-white" 
                        />
                        <div className="flex items-center gap-2">
                          <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-brand-1/25 hover:bg-brand-1 text-belief-white px-4 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <ImagePlus className="w-3.5 h-3.5" /> Subir archivo de imagen
                          </button>
                          <span className="text-[10px] opacity-45">Formatos de imagen válidos PNG, JPG, GIF</span>
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleLogoUpload} 
                            accept="image/*" 
                            className="hidden" 
                          />
                        </div>
                      </div>
                      
                      <div className="w-full h-24 rounded-xl border border-white/10 flex items-center justify-center bg-black/30 overflow-hidden relative group">
                        {regLogo ? (
                          <>
                            <img src={regLogo} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => setRegLogo('')}
                              className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400 text-[10px] uppercase font-bold cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </>
                        ) : (
                          <div className="text-center opacity-40 p-2">
                            <ImagePlus className="w-6 h-6 mx-auto mb-1" />
                            <span className="text-[9px] uppercase tracking-wider block">Sin Imagen de Portada</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* MISSION AND VISION EDITORS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold text-brand-2">Misión de la Iglesia</label>
                      <textarea 
                        rows={3}
                        value={regMission}
                        onChange={(e) => setRegMission(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-brand-2 text-white resize-none font-sans" 
                        placeholder="Describe el llamado de fe o propósito central. Ej: Propagar el evangelio sirviendo comunitariamente..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold text-brand-1">Visión de la Iglesia</label>
                      <textarea 
                        rows={3}
                        value={regVision}
                        onChange={(e) => setRegVision(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-brand-2 text-white resize-none font-sans" 
                        placeholder="Ej: Ser un centro de avivamiento global sustentado en redes de amor y discipulado congregacional..."
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-brand-2 hover:bg-brand-3 text-stone-900 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all cursor-pointer shadow-lg shadow-brand-2/15">
                    Registrar e Integrar en Mapa de Believe
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real Dynamic Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
           <div className="glass-panel p-6 rounded-2xl border border-theme-border">
             <h4 className="text-xs uppercase tracking-widest opacity-60 mb-2 font-sans text-brand-1">Iglesias Totales</h4>
             <div className="text-3xl font-serif text-brand-4 font-bold">{totalChurchesCount}</div>
             <p className="text-[10px] text-brand-5 mt-2">Sincronizadas en DB</p>
           </div>
           <div className="glass-panel p-6 rounded-2xl border border-theme-border">
             <h4 className="text-xs uppercase tracking-widest opacity-60 mb-2 font-sans text-brand-1">Usuarios Globales</h4>
             <div className="text-2xl md:text-3xl font-serif text-brand-3 font-bold">{usersCount}</div>
           </div>
           <div className="glass-panel p-6 rounded-2xl border border-theme-border">
             <h4 className="text-xs uppercase tracking-widest opacity-60 mb-2 font-sans text-brand-1">Peticiones App</h4>
             <div className="text-3xl font-serif text-brand-2 font-bold">8,950</div>
             <p className="text-[10px] text-brand-4 mt-2">Proceso automático</p>
           </div>
           <div className="glass-panel p-6 rounded-2xl border border-theme-border">
             <h4 className="text-xs uppercase tracking-widest opacity-60 mb-2 font-sans text-brand-1">Recaudación / Suscripciones</h4>
             <div className="text-2xl md:text-3xl font-serif text-brand-5 font-bold">${revenue}</div>
             <p className="text-[10px] opacity-50 mt-2">Fondo global mensual</p>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Incoming registration requests */}
          <div className="glass-panel p-8 rounded-3xl border border-theme-border">
            <h3 className="font-serif text-xl mb-6 text-brand-1 font-bold uppercase tracking-wide">Solicitudes Recibidas (Iglesias Pendientes)</h3>
            
            {pendingChurches.length > 0 ? (
              <div className="space-y-4 font-sans font-light text-sm">
                {pendingChurches.map((church) => (
                  <div key={church.id} className="flex flex-col py-4 border-b border-white/5 last:border-0 gap-4">
                    <div className="flex justify-between items-start gap-4">
                      {church.logo && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 hidden sm:block">
                          <img src={church.logo} alt={church.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-belief-white font-serif text-lg">{church.name}</p>
                        <p className="text-[11px] uppercase tracking-wider text-brand-2 mb-1">{church.pastors} • {church.loc}</p>
                        <p className="text-xs opacity-60 mb-2">{church.email} • {church.address}</p>
                        
                        {(church.mission || church.vision) && (
                          <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-2 mt-2">
                            {church.mission && (
                              <div>
                                <p className="text-[9px] uppercase tracking-widest text-brand-3 font-bold mb-0.5">Misión</p>
                                <p className="text-xs opacity-80 leading-relaxed italic">"{church.mission}"</p>
                              </div>
                            )}
                            {church.vision && (
                              <div>
                                <p className="text-[9px] uppercase tracking-widest text-brand-4 font-bold mb-0.5">Visión</p>
                                <p className="text-xs opacity-80 leading-relaxed italic">"{church.vision}"</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 shrink-0">
                        <button 
                          onClick={() => handleApprovePending(church)}
                          className="px-4 py-2 bg-brand-5 hover:bg-brand-5/80 text-black rounded-xl text-xs font-bold transition-colors cursor-pointer w-full"
                        >
                          Aprobar
                        </button>
                        <button 
                          onClick={() => handleRejectPending(church.id, church.email)}
                          className="px-4 py-2 bg-brand-1 hover:bg-brand-1/80 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer w-full"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Check className="w-8 h-8 text-brand-5 mx-auto mb-2" />
                <p className="text-xs opacity-60">No hay solicitudes de iglesias pendientes en este momento.</p>
              </div>
            )}
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-theme-border">
            <h3 className="font-serif text-xl mb-6 text-brand-1 font-bold uppercase tracking-wide">Operaciones de Servidor</h3>
            <div className="space-y-4 font-sans font-light text-sm">
               <div className="flex items-center gap-3 py-3 border-b border-white/5">
                 <div className="w-2 h-2 rounded-full bg-brand-5 animate-pulse"></div>
                 <span>Servidor central Believe operando a tasa óptima (0.0.0.0:3000).</span>
               </div>
               <div className="flex items-center gap-3 py-3">
                 <div className="w-2 h-2 rounded-full bg-brand-3"></div>
                 <span>Respaldos automáticos ejecutándose de forma ininterrumpida.</span>
               </div>
            </div>
          </div>
        </div>

        {/* List of currently registered churches, allowing management */}
        <div className="glass-panel p-8 rounded-3xl border border-theme-border">
          <h3 className="font-serif text-xl mb-6 text-brand-3 font-bold uppercase tracking-wide">Iglesias Registradas Activas e Integradas</h3>
          {registeredChurchesList.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {registeredChurchesList.map((ch) => (
                <div key={ch.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-sm text-belief-white">{ch.name}</h5>
                    <p className="text-xs opacity-60 flex items-center gap-1"><MapPin className="w-3 h-3" /> {ch.loc} • {ch.address}</p>
                    <p className="text-[10px] opacity-40 mt-1">{ch.members} miembros</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteChurch(ch.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors cursor-pointer"
                    title="Eliminar del mapa y registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-zinc-500">
              <MapPin className="w-8 h-8 text-brand-1/40 mx-auto mb-2" />
              <p className="text-xs">Aún no hay iglesias registradas en la plataforma.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
