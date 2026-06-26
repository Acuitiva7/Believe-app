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
  const userId = user?.email || 'default';
  const [activeTab, setActiveTab] = useState<'descubrir' | 'comunidad' | 'diario'>('descubrir');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  const [linkedChurch, setLinkedChurch] = useState<string | null>(() => localStorage.getItem(`belief-linked-church-${userId}`));
  const [hasLinkedChurch, setHasLinkedChurch] = useState(() => localStorage.getItem(`belief-has-linked-church-${userId}`) === 'true');
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingChurch, setInspectingChurch] = useState<Church | null>(null);

  useEffect(() => {
    setAnnouncements(getLocalAnnouncements());
    setChurches(getLocalChurches());
    setLinkedChurch(localStorage.getItem(`belief-linked-church-${userId}`));
    setHasLinkedChurch(localStorage.getItem(`belief-has-linked-church-${userId}`) === 'true');
  }, [activeTab, userId]);

  const handleLike = (id: string) => {
    const updated = announcements.map(ann => {
      if (ann.id === id) {
        const likedSymbol = `belief-liked-ann-${id}-${userId}`;
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
    return localStorage.getItem(`belief-liked-ann-${id}-${userId}`) === 'true';
  };

  const handleAddComment = (postId: string) => {
    const text = newComment[postId]?.trim();
    if (!text) return;

    const loggedName = localStorage.getItem(`belief-user-name-${userId}`) || user?.email?.split('@')[0] || 'Usuario Believe';
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
    localStorage.setItem(`belief-linked-church-${userId}`, churchName);
    localStorage.setItem(`belief-has-linked-church-${userId}`, 'true');
    setLinkedChurch(churchName);
    setHasLinkedChurch(true);
  };

  const handleLeaveChurch = () => {
    localStorage.removeItem(`belief-linked-church-${userId}`);
    localStorage.setItem(`belief-has-linked-church-${userId}`, 'false');
    setLinkedChurch(null);
    setHasLinkedChurch(false);
  };

  // Filter global posts
  const globalAnnouncements = announcements.filter(a => a.category === 'global');
  
  // Filter local posts of current church
  const localAnnouncements = announcements.filter(a => a.category === 'local' && a.churchName === linkedChurch);

  return (
    <div className="min-h-screen pt-32 px-4 pb-24 bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Tab Selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-10">
          <div className="bg-white p-1.5 inline-flex rounded-full border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('descubrir')}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all ${
                activeTab === 'descubrir' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-800 cursor-pointer'
              }`}
            >
              <span className="flex items-center gap-2"><Compass className="w-4 h-4" /> Global</span>
            </button>
            <button
              onClick={() => setActiveTab('comunidad')}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === 'comunidad' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-800 cursor-pointer'
              }`}
            >
              <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Comunidad</span>
            </button>
            <button
              onClick={() => setActiveTab('diario')}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === 'diario' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-800 cursor-pointer'
              }`}
            >
              <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> Diario</span>
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
                    <motion.div key={ann.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-slate-200 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm uppercase ring-4 ring-amber-50">
                            G
                          </div>
                          <div>
                            <h3 className="font-sans font-bold text-sm text-slate-800">{ann.author}</h3>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Boletín Oficial • {ann.date}</p>
                          </div>
                        </div>
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">Global</span>
                      </div>
                      <h2 className="font-serif text-2xl mb-4 font-semibold text-slate-900 leading-snug">{ann.title}</h2>
                      <p className="font-sans text-sm text-slate-600 mb-6 leading-relaxed whitespace-pre-line">
                        {ann.content}
                      </p>
                      
                      {/* Likes & Comments inside Global */}
                      <div className="flex flex-col gap-4 pt-5 border-t border-slate-100">
                        <div className="flex items-center gap-6">
                          <button 
                            onClick={() => handleLike(ann.id)} 
                            className={`flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer ${isPostLiked(ann.id) ? 'text-rose-500' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            <Heart className={`w-4 h-4 ${isPostLiked(ann.id) ? 'fill-current text-rose-500' : ''}`} /> {ann.likes} Me gusta
                          </button>
                        </div>

                        {/* Custom Comments list for global */}
                        <div className="space-y-3 mt-2">
                          {ann.comments && ann.comments.map((comm, idx) => (
                            <div key={idx} className="flex gap-3 bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                              <span className="font-bold text-primary shrink-0">{comm.author}</span>
                              <span className="text-slate-700 leading-relaxed">{comm.text}</span>
                            </div>
                          ))}
                          
                          <div className="relative flex gap-3 pt-2">
                            <input 
                              type="text" 
                              value={newComment[ann.id] || ''}
                              onChange={(e) => setNewComment(prev => ({ ...prev, [ann.id]: e.target.value }))}
                              placeholder="Escribe un comentario..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" 
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(ann.id)}
                            />
                            <button 
                              onClick={() => handleAddComment(ann.id)}
                              className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-full hover:bg-slate-800 transition-colors shrink-0"
                            >
                              Publicar
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white p-10 rounded-3xl text-center border border-slate-200 shadow-sm mb-4">
                    <p className="font-serif text-lg text-slate-500">No hay comunicados globales activos en este momento.</p>
                  </div>
                )}
              </div>

              {/* Word of the Day Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="md:col-span-2 bg-gradient-to-br from-primary to-blue-800 text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                  <h3 className="text-xs uppercase tracking-widest text-blue-200 mb-3 font-semibold font-sans">Palabra de Hoy</h3>
                  <h2 className="font-serif text-3xl sm:text-4xl mb-4 italic leading-tight text-white">"Por tanto, os digo que todo lo que pidiereis orando, creed que lo recibiréis..."</h2>
                  <p className="font-sans text-sm text-blue-200 mb-6 font-semibold">Marcos 11:24</p>
                  <div className="text-sm text-blue-100/90 leading-relaxed max-w-xl font-sans">
                     La oración activa no es un deseo estático; es la convicción profunda de que Dios atiende con amor y obrará conforme a su perfecta voluntad en el momento propicio.
                  </div>
                </div>

                {/* Quick Link/Search Widget */}
                <div className="bg-white p-8 rounded-3xl flex flex-col justify-between border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-sky-200/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <h3 className="font-serif text-xl font-bold mb-3 flex items-center gap-2 text-slate-900">
                      <Search className="w-5 h-5 text-sky-500" /> Mi Iglesia Local
                    </h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                      Conéctate con tu congregación para ver boletines y eventos exclusivos.
                    </p>
                  </div>
                  <div className="relative z-10">
                  {linkedChurch ? (
                    <div className="bg-sky-50 p-5 rounded-2xl border border-sky-100">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-sky-600 mb-1">Vinculado actualmente a:</p>
                      <p className="font-bold text-slate-900 text-lg font-serif mb-3">{linkedChurch}</p>
                      <button onClick={handleLeaveChurch} className="text-xs font-semibold text-sky-600 hover:text-sky-700 uppercase tracking-widest transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3"/> Desvincular</button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                      <p className="mb-4 font-sans text-sm text-slate-600">Aún no tienes iglesia vinculada.</p>
                      <button onClick={() => setActiveTab('comunidad')} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm transition-all hover:bg-slate-800">Encontrar Ahora</button>
                    </div>
                  )}
                  </div>
                </div>
              </div>

              {/* Suggestions / Nearby Info */}
              <div className="mb-8">
                <h3 className="font-serif text-2xl mb-6 font-bold text-slate-900">Iglesias destacadas en la red</h3>
                {churches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {churches.slice(0, 3).map((church) => (
                      <div key={church.id} className="bg-white rounded-3xl overflow-hidden group border border-slate-200 hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between shadow-sm">
                        <div>
                          <div className="h-32 bg-slate-100 relative flex items-center justify-center border-b border-slate-200 overflow-hidden">
                            {church.logo ? (
                              <img src={church.logo} alt={church.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <MapPin className="w-8 h-8 text-slate-300 group-hover:text-primary transition-colors duration-300" />
                            )}
                          </div>
                          <div className="p-6">
                            <h4 className="font-bold text-lg mb-2 text-slate-900 truncate font-serif">{church.name}</h4>
                            <p className="text-sm text-slate-600 flex items-center gap-1.5 mb-2"><MapPin className="w-4 h-4 text-slate-400" /> {church.loc}</p>
                            <p className="text-xs font-semibold text-primary/80 bg-primary/5 inline-flex items-center px-2 py-1 rounded-md">{church.members} miembros</p>
                          </div>
                        </div>
                        <div className="px-6 pb-6 pt-0 flex gap-3">
                          <button 
                            onClick={() => setInspectingChurch(church)}
                            className="flex-1 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl border border-slate-200 transition-all text-center"
                          >
                            Ver Perfil
                          </button>
                          <button 
                            onClick={() => handleJoinChurch(church.name)}
                            className="flex-1 text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary py-2.5 rounded-xl border border-primary/20 transition-all text-center"
                          >
                            Vincularme
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-10 rounded-3xl text-center border border-dashed border-slate-300">
                    <p className="font-sans text-slate-500 text-sm">No hay iglesias registradas en la plataforma todavía.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'comunidad' && (
            <motion.div key="comunidad" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {!hasLinkedChurch || !linkedChurch ? (
                 <div className="bg-white p-12 rounded-3xl text-center max-w-2xl mx-auto border border-slate-200 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5">
                     <Users className="w-8 h-8 text-primary" />
                   </div>
                   <h2 className="font-serif text-3xl mb-4 font-bold tracking-tight text-slate-900">Aún no estás en una comunidad</h2>
                   <p className="font-sans text-sm text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">
                     Para ver los boletines locales, anuncios y eventos de tu pastor y lideres, vincula tu iglesia participante del directorio global.
                   </p>
                   
                   {churches.length > 0 ? (
                     <div className="space-y-4 max-w-lg mx-auto relative z-10">
                       <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Selecciona una congregación:</p>
                       <div className="grid grid-cols-1 gap-3">
                         {churches.map((c) => (
                           <div 
                             key={c.id}
                             className="p-4 bg-slate-50 border border-slate-200 hover:border-primary/50 hover:shadow-sm rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all gap-4 text-left"
                           >
                             <div>
                               <p className="font-bold text-slate-900 font-serif">{c.name}</p>
                               <span className="text-slate-500 text-xs flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> {c.loc}</span>
                             </div>
                             <div className="flex gap-2 w-full sm:w-auto">
                               <button 
                                 type="button"
                                 onClick={() => setInspectingChurch(c)}
                                 className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors hover:bg-slate-100"
                               >
                                 Ver Perfil
                               </button>
                               <button 
                                 type="button"
                                 onClick={() => handleJoinChurch(c.name)}
                                 className="flex-1 sm:flex-none px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
                               >
                                 Vincular
                               </button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   ) : (
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 max-w-md mx-auto text-sm text-slate-500">
                       <p>Actualmente no hay iglesias en el directorio. Revisa el mapa global.</p>
                     </div>
                   )}
                 </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Local Feed */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Comunidad Activa:</span>
                        <div className="text-slate-900 font-serif text-lg font-bold mt-1">{linkedChurch}</div>
                      </div>
                      <button onClick={handleLeaveChurch} className="text-xs bg-white border border-slate-200 px-4 py-2 rounded-xl font-semibold text-slate-600 hover:text-red-500 hover:border-red-500/50 transition-colors shadow-sm">Cambiar iglesia</button>
                    </div>

                    {localAnnouncements.length > 0 ? (
                      localAnnouncements.map((ann) => (
                        <div key={ann.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-serif text-xl border border-sky-200 font-bold shadow-sm">
                               {ann.author?.[0]?.toUpperCase() || 'P'}
                            </div>
                            <div>
                              <h3 className="font-sans font-bold text-base text-slate-900">{ann.author}</h3>
                              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest mt-1">{ann.date} • Anuncio Local</p>
                            </div>
                          </div>
                          
                          <h2 className="font-serif text-2xl mb-4 text-slate-900 font-bold leading-tight">{ann.title}</h2>
                          <p className="font-sans text-sm text-slate-600 leading-relaxed max-w-3xl whitespace-pre-line mb-8">
                            {ann.content}
                          </p>

                          {/* Likes / Comments Loop */}
                          <div className="flex flex-col gap-5 pt-5 border-t border-slate-100">
                            <div className="flex items-center gap-6">
                              <button 
                                onClick={() => handleLike(ann.id)} 
                                className={`flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer ${isPostLiked(ann.id) ? 'text-rose-500' : 'text-slate-500 hover:text-slate-700'}`}
                              >
                                <Heart className={`w-4 h-4 ${isPostLiked(ann.id) ? 'fill-current text-rose-500' : ''}`} /> {ann.likes} Me gusta
                              </button>
                            </div>

                            {/* Comments block */}
                            <div className="space-y-3">
                              {ann.comments && ann.comments.map((comm, idx) => (
                                <div key={idx} className="flex gap-3 bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                                  <span className="font-bold text-sky-600 shrink-0">{comm.author}</span>
                                  <span className="text-slate-700 leading-relaxed">{comm.text}</span>
                                </div>
                              ))}
                              
                              <div className="relative flex gap-3 pt-2">
                                <input 
                                  type="text" 
                                  value={newComment[ann.id] || ''}
                                  onChange={(e) => setNewComment(prev => ({ ...prev, [ann.id]: e.target.value }))}
                                  placeholder="Escribe un mensaje o petición..."
                                  className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-shadow" 
                                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(ann.id)}
                                />
                                <button 
                                  onClick={() => handleAddComment(ann.id)}
                                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-full transition-colors shrink-0 shadow-sm"
                                >
                                  Enviar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white p-10 rounded-3xl text-center border border-dashed border-slate-300">
                        <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="font-serif text-lg text-slate-600">Este feed local está tranquilo.</p>
                        <p className="text-sm text-slate-500 mt-2">Pronto los líderes de la asamblea publicarán aquí.</p>
                      </div>
                    )}
                  </div>

                  {/* Sidebar stats/info */}
                  <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <Bell className="w-5 h-5 text-amber-500" />
                          <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-slate-800">Avisos Locales</h3>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="border-b border-slate-100 pb-4">
                          <p className="font-sans text-xs mb-1 text-slate-800 font-semibold">Campaña de abrigos de invierno</p>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium"><Calendar className="w-3 h-3"/> Hasta el 30 de Nov.</span>
                        </div>
                        <div className="border-b border-slate-100 pb-4">
                          <p className="font-sans text-xs mb-1 text-slate-800 font-semibold">Ensayo general coro de Navidad</p>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium"><Calendar className="w-3 h-3"/> Jueves 19:00</span>
                        </div>
                        <div>
                          <p className="font-sans text-xs mb-1 text-slate-800 font-semibold">Estudio Bíblico General</p>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium"><Calendar className="w-3 h-3"/> Próxima semana</span>
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
                <Journal userId={userId} />
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
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 10 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 10 }} 
                className="bg-white overflow-hidden max-w-2xl w-full rounded-3xl border border-slate-200 relative max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                {/* Header Close button */}
                <button 
                  onClick={() => setInspectingChurch(null)}
                  className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 cursor-pointer transition-colors backdrop-blur-md"
                >
                  <span className="sr-only">Cerrar</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Banner image/logo */}
                <div className="h-64 relative bg-slate-100 flex items-center justify-center text-center overflow-hidden border-b border-slate-200">
                  {inspectingChurch.logo ? (
                    <img src={inspectingChurch.logo} alt={inspectingChurch.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-6 text-slate-400">
                      <MapPin className="w-16 h-16 animate-pulse" />
                      <span className="text-[11px] uppercase tracking-widest font-bold">Unida virtualmente</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent p-8 text-left flex flex-col justify-end pt-24">
                    <h3 className="font-serif text-3xl font-bold text-white tracking-tight mb-2">{inspectingChurch.name}</h3>
                    <p className="text-sm text-sky-200 font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {inspectingChurch.address} ({inspectingChurch.loc})
                    </p>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-8 space-y-8">
                  {/* Mission & Vision */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute top-2 right-2 opacity-10 text-4xl font-serif text-sky-600">M</div>
                      <h4 className="font-serif text-sm font-bold text-sky-700 uppercase tracking-widest mb-3">Nuestra Misión</h4>
                      <p className="font-sans text-sm text-sky-900/80 leading-relaxed whitespace-pre-line italic">
                        {inspectingChurch.mission || "Llevar la palabra de vida para conectar corazones y propósito, amparando espiritualmente bajo la fe y promoviendo el servicio social mutuo."}
                      </p>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute top-2 right-2 opacity-10 text-4xl font-serif text-amber-600">V</div>
                      <h4 className="font-serif text-sm font-bold text-amber-700 uppercase tracking-widest mb-3">Nuestra Visión</h4>
                      <p className="font-sans text-sm text-amber-900/80 leading-relaxed whitespace-pre-line italic">
                        {inspectingChurch.vision || "Ser un faro de esperanza mundial y un puente interactivo capaz de proveer sanidad integral a las familias apoyándonos en la red divina."}
                      </p>
                    </div>
                  </div>

                  {/* General Stats */}
                  <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="text-center flex-1">
                      <span className="block text-slate-500 font-semibold uppercase text-[10px] tracking-widest mb-1">Miembros Acumulados</span>
                      <span className="font-bold text-slate-900 text-2xl font-serif">{inspectingChurch.members}</span>
                    </div>
                    <div className="w-px h-12 bg-slate-200"></div>
                    <div className="text-center flex-1">
                      <span className="block text-slate-500 font-semibold uppercase text-[10px] tracking-widest mb-1">Estado en Directorio</span>
                      <span className="font-bold text-emerald-600 text-lg font-sans">Verificada ✓</span>
                    </div>
                  </div>

                  {/* Join / Bind action */}
                  <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => {
                        handleJoinChurch(inspectingChurch.name);
                        setInspectingChurch(null);
                      }}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl text-sm uppercase tracking-wider transition-all shadow-sm text-center cursor-pointer"
                    >
                      {linkedChurch === inspectingChurch.name ? "Ya estás vinculado" : "Vincular a mi Perfil"}
                    </button>
                    <button 
                      onClick={() => setInspectingChurch(null)}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold py-4 px-8 rounded-xl text-sm uppercase tracking-wider transition-all text-center cursor-pointer"
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
      <div className="min-h-screen pt-32 px-4 pb-24 bg-slate-50 text-slate-800 flex justify-center font-sans">
        <div className="max-w-3xl w-full bg-white p-10 rounded-3xl border-t-8 border-t-primary border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h2 className="font-serif text-4xl mb-3 text-slate-900 font-bold tracking-tight">Crea tu Comunidad</h2>
          <p className="font-sans text-base text-slate-600 mb-10 leading-relaxed max-w-xl">Por favor, registra los datos oficiales de tu congregación para que sean evaluados por la administración y formen parte del directorio global.</p>
          
          <form onSubmit={submitChurchRegistration} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Nombre de la Iglesia *</label>
                <input required type="text" value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 transition-shadow" placeholder="Ej: Iglesia Vida Nueva" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Ciudad / País *</label>
                <input required type="text" value={regLoc} onChange={(e) => setRegLoc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 transition-shadow" placeholder="Ej: Madrid, ES" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Dirección Completa *</label>
                <input required type="text" value={regAddress} onChange={(e) => setRegAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 transition-shadow" placeholder="Ej: Calle Mayor 12" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Pastores / Líderes Principales *</label>
                <input required type="text" value={regPastors} onChange={(e) => setRegPastors(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 transition-shadow" placeholder="Ej: Ps. Juan y María" />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl">
              <label className="block text-xs uppercase tracking-widest text-slate-600 mb-4 font-bold">Logo o Foto de Portada (Opcional)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 w-full md:w-auto shadow-sm">
                      <ImagePlus className="w-4 h-4" /> Subir Fotografía
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">Formatos recomendados: JPG, PNG. Tamaño máximo 5MB.</p>
                </div>
                {regLogo && (
                  <div className="w-full h-28 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <img src={regLogo} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-sky-600 mb-2 font-bold">Misión *</label>
                <textarea required rows={4} value={regMission} onChange={(e) => setRegMission(e.target.value)} className="w-full bg-sky-50/50 border border-sky-100 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-slate-900 resize-none transition-shadow" placeholder="Propósito central..." />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-600 mb-2 font-bold">Visión *</label>
                <textarea required rows={4} value={regVision} onChange={(e) => setRegVision(e.target.value)} className="w-full bg-amber-50/50 border border-amber-100 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-900 resize-none transition-shadow" placeholder="Visión a futuro..." />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-full text-sm uppercase tracking-widest font-bold transition-colors cursor-pointer shadow-md">
                Enviar Solicitud de Registro
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (isPending && !isApproved) {
    return (
      <div className="min-h-screen pt-32 px-4 pb-24 bg-slate-50 text-slate-800 flex justify-center text-center font-sans">
        <div className="max-w-xl w-full bg-white p-12 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-white">
              <Compass className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h2 className="font-serif text-3xl mb-4 text-slate-900 font-bold tracking-tight">Solicitud en Proceso</h2>
            <p className="font-sans text-base text-slate-600 mb-6 leading-relaxed">Tu congregación está siendo evaluada por la administración. Te notificaremos una vez que sea aprobada y conectada al Directorio Global de Believe.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 pb-24 bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-slate-200 pb-8 relative">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-slate-900 mb-3 font-bold tracking-tight">Panel Pastoral Local</h1>
            <p className="font-sans text-slate-600 text-base">
              Administrando comunidad: <strong className="text-primary font-serif font-bold text-lg ml-1">{localChurchName}</strong>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setShowEventForm(!showEventForm)} className={`${showEventForm ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-primary text-white hover:bg-primary/90'} px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-2`}>
              {showEventForm ? '× Cancelar' : '+ Crear Anuncio / Evento'}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showEventForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-10 overflow-hidden">
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <h3 className="font-serif text-2xl mb-8 text-slate-900 font-bold relative z-10 flex items-center gap-3"><Send className="w-5 h-5 text-primary" /> Redactar Comunicado a la Iglesia</h3>
                
                {pushedOk ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-5 rounded-2xl flex items-center gap-3 mb-8 font-bold text-sm tracking-wide relative z-10">
                    <div className="bg-emerald-100 p-1.5 rounded-full"><Check className="w-5 h-5 text-emerald-600" /></div> ¡Anuncio u boletín publicado con éxito directamente al feed de los miembros!
                  </div>
                ) : null}

                <form onSubmit={handlePostLocalSubmit} className="space-y-6 relative z-10">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Título del Mensaje</label>
                    <input 
                      required
                      type="text" 
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 transition-shadow" 
                      placeholder="Ej: Gran Campaña de Solidaridad de Invierno"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Autor / Firma Visible</label>
                      <input 
                        required
                        type="text" 
                        value={postAuthor}
                        onChange={(e) => setPostAuthor(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 transition-shadow" 
                        placeholder="Ej: Pastor General / Liderazgo de Jóvenes"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Distribución Exclusiva Para:</label>
                      <input 
                        disabled
                        type="text" 
                        value={localChurchName}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3.5 px-5 text-sm text-slate-500 cursor-not-allowed font-medium" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Cuerpo del Mensaje o Detalles del Evento</label>
                    <textarea 
                      required
                      rows={5} 
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-slate-900 font-sans transition-shadow" 
                      placeholder="Escribe el propósito de la publicación, cita bíblica, fechas o información importante..."
                    />
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-3 w-full md:w-auto shadow-md">
                       Publicar Ahora <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 bg-sky-50 w-24 h-24 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
             <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 relative z-10">Miembros Activos</h4>
             <div className="text-3xl sm:text-4xl font-serif text-slate-900 font-bold relative z-10">{localMembersCount}</div>
             <p className="text-xs text-emerald-600 mt-2 font-semibold bg-emerald-50 inline-block px-2 py-1 rounded-md relative z-10">+12% este mes</p>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 bg-amber-50 w-24 h-24 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
             <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 relative z-10">Células / Grupos</h4>
             <div className="text-3xl sm:text-4xl font-serif text-slate-900 font-bold relative z-10">24</div>
             <p className="text-xs text-slate-500 mt-2 font-medium relative z-10">Activos en plataforma</p>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 bg-rose-50 w-24 h-24 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
             <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 relative z-10">Peticiones de Oración</h4>
             <div className="text-3xl sm:text-4xl font-serif text-slate-900 font-bold relative z-10">{prayersCount}</div>
             <p className="text-xs text-rose-500 mt-2 font-semibold relative z-10 tracking-tight">Atención requerida</p>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 bg-indigo-50 w-24 h-24 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
             <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 relative z-10">Retención Semanal</h4>
             <div className="text-3xl sm:text-4xl font-serif text-slate-900 font-bold relative z-10">85%</div>
             <p className="text-xs text-slate-500 mt-2 font-medium relative z-10">Promedio general</p>
           </div>
        </div>

        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm max-w-4xl">
          <h3 className="font-serif text-xl mb-8 text-slate-900 font-bold flex items-center gap-2">Registro de Actividad Reciente</h3>
          <div className="space-y-2">
             <div className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
               <span className="text-sm text-slate-700 font-medium leading-relaxed">Nuevo hermano se ha vinculado exitosamente al directorio local.</span>
               <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0 bg-slate-50 px-2.5 py-1 rounded-md">Hace 5 min</span>
             </div>
             <div className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
               <span className="text-sm text-slate-700 font-medium leading-relaxed">Pastor {user?.email || 'Principal'} programó Ensayo General de Coro para el día Jueves.</span>
               <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0 bg-slate-50 px-2.5 py-1 rounded-md">Hace 2 horas</span>
             </div>
             <div className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
               <span className="text-sm text-slate-700 font-medium leading-relaxed">Actualización masiva de estatutos misioneros enviada a la comunidad.</span>
               <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0 bg-slate-50 px-2.5 py-1 rounded-md">Hace 1 día</span>
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

  // Dynamic statistics calculated from real data
  const [registeredChurchesList, setRegisteredChurchesList] = useState<Church[]>(() => getLocalChurches());
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>(() => getLocalAnnouncements());
  
  const totalChurchesCount = registeredChurchesList.length;
  const usersCount = registeredChurchesList.reduce((acc, church) => acc + (church.members || 0), 0) + 1; // Real registered numbers + super admin
  const prayersCount = allAnnouncements.reduce((acc, ann) => acc + (ann.likes || 0) + (ann.prayers || 0), 0); // Real prayers over feed

  // Dynamic Pending Requests list
  const [pendingChurches, setPendingChurches] = useState<{id: string, name: string, email: string, loc: string, address: string, logo?: string, mission?: string, vision?: string, pastors?: string}[]>(() => {
    const saved = localStorage.getItem('belief-pending-churches');
    if (saved) return JSON.parse(saved);
    return [];
  });

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

    setAllAnnouncements(getLocalAnnouncements());
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

    addLocalChurch({
      name: regName,
      loc: regLoc,
      address: regAddress,
      members: regMembers,
      logo: regLogo || undefined,
      mission: regMission.trim() || undefined,
      vision: regVision.trim() || undefined
    });

    setRegisteredChurchesList(getLocalChurches());

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
    setRegisteredChurchesList(getLocalChurches());
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
  };

  return (
    <div className="min-h-screen pt-32 px-4 pb-24 text-slate-800 dark:text-slate-100 font-sans">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold inline-block mb-2">Panel Autoritativo</span>
            <h1 className="font-serif text-3xl md:text-4xl text-slate-900 dark:text-white font-bold tracking-tight">Consola de Creador</h1>
            <p className="font-sans font-light opacity-70">Control total de la plataforma Believe</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => {
                setShowRegisterChurchForm(!showRegisterChurchForm);
                setShowGlobalPost(false);
              }} 
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 px-6 py-2.5 rounded-xl font-bold transition-all text-sm shadow-sm cursor-pointer"
            >
              {showRegisterChurchForm ? 'Cancelar' : 'Alta de Comunidad'}
            </button>
            <button 
              onClick={() => {
                setShowGlobalPost(!showGlobalPost);
                setShowRegisterChurchForm(false);
              }} 
              className="bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all text-sm shadow-md cursor-pointer flex items-center gap-2"
            >
              {showGlobalPost ? 'Cancelar' : <><Send className="w-4 h-4"/> Anuncio Global</>}
            </button>
          </div>
        </motion.div>

        {/* Global Announcement Post form */}
        <AnimatePresence>
          {showGlobalPost && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                <h3 className="font-serif text-2xl mb-6 text-slate-900 dark:text-white flex items-center gap-2 font-bold tracking-tight">Comunicado Global</h3>
                
                {globalSuccess && (
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-center gap-2 mb-6 font-semibold text-sm">
                    <Check className="w-5 h-5 animate-pulse" /> Boletín global publicado y sincronizado.
                  </div>
                )}

                <form onSubmit={handlePostGlobalSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Título del Anuncio Global</label>
                    <input 
                      required
                      type="text" 
                      value={globalTitle}
                      onChange={(e) => setGlobalTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" 
                      placeholder="Ej: Bienvenida Oficial 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Cuerpo del Mensaje</label>
                    <textarea 
                      required
                      rows={5} 
                      value={globalContent}
                      onChange={(e) => setGlobalContent(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none" 
                      placeholder="Escribe el boletín..."
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md">
                      Publicar Oficialmente
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
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-sky-400"></div>
                <h3 className="font-serif text-2xl mb-6 text-slate-900 dark:text-white flex items-center gap-2 font-bold tracking-tight">Alta de Congregación Activa</h3>
                
                {churchSuccess && (
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-center gap-2 mb-6 font-semibold text-sm">
                    <Check className="w-5 h-5" /> ¡Iglesia participante dada de alta e integrada en el directorio!
                  </div>
                )}

                <form onSubmit={handleRegisterChurchSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Nombre de la Iglesia</label>
                      <input 
                        required
                        type="text" 
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/50" 
                        placeholder="Ej: Iglesia Vida Nueva"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Ciudad / País</label>
                      <input 
                        required
                        type="text" 
                        value={regLoc}
                        onChange={(e) => setRegLoc(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/50" 
                        placeholder="Ej: Madrid, ES"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Dirección Completa</label>
                      <input 
                        required
                        type="text" 
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/50" 
                        placeholder="Ej: Calle Gran Vía 12, Centro"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Miembros Registrados</label>
                      <input 
                        required
                        type="number" 
                        value={regMembers}
                        onChange={(e) => setRegMembers(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/50" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Misión de la Iglesia</label>
                      <textarea 
                        rows={3}
                        value={regMission}
                        onChange={(e) => setRegMission(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/50 resize-none font-sans" 
                        placeholder="Describe el llamado de fe o propósito central..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Visión de la Iglesia</label>
                      <textarea 
                        rows={3}
                        value={regVision}
                        onChange={(e) => setRegVision(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/50 resize-none font-sans" 
                        placeholder="Visualización a futuro..."
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-secondary hover:bg-sky-500 text-white py-4 rounded-xl font-semibold transition-all shadow-md">
                    Registrar e Integrar en Directorio
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real Dynamic Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
           <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-all"></div>
             <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">Comunidades Activas</h4>
             <div className="text-4xl font-serif text-slate-900 dark:text-white font-black">{totalChurchesCount}</div>
             <p className="text-xs text-primary font-medium mt-3 flex items-center gap-2"><Globe className="w-3 h-3" /> Registradas</p>
           </div>
           <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-sky-400/20 transition-all"></div>
             <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">Usuarios Creyentes</h4>
             <div className="text-4xl font-serif text-slate-900 dark:text-white font-black">{usersCount}</div>
             <p className="text-xs text-secondary font-medium mt-3 flex items-center gap-2"><Users className="w-3 h-3" /> Formando comunidad</p>
           </div>
           <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-all"></div>
             <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">Vidas Impactadas (Interacciones)</h4>
             <div className="text-4xl font-serif text-slate-900 dark:text-white font-black">{prayersCount}</div>
             <p className="text-xs text-amber-500 font-medium mt-3 flex items-center gap-2"><Sparkles className="w-3 h-3" /> A través del feed</p>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Incoming registration requests */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-serif text-xl mb-6 text-slate-800 dark:text-slate-100 font-bold tracking-tight">Solicitudes de Iglesias Pendientes</h3>
            
            {pendingChurches.length > 0 ? (
              <div className="space-y-4">
                {pendingChurches.map((church) => (
                  <div key={church.id} className="p-5 border border-slate-200 dark:border-slate-700/80 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:border-primary/30 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 dark:text-white font-serif text-lg">{church.name}</p>
                        <p className="text-[11px] font-semibold text-primary mb-2 uppercase tracking-wide">{church.pastors} • {church.loc}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{church.email} • {church.address}</p>
                        
                        {(church.mission || church.vision) && (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 space-y-3 mt-2 shadow-sm">
                            {church.mission && (
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Misión</p>
                                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed text-balance">"{church.mission}"</p>
                              </div>
                            )}
                            {church.vision && (
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Visión</p>
                                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed text-balance">"{church.vision}"</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto shrink-0">
                        <button 
                          onClick={() => handleApprovePending(church)}
                          className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                          Aprobar
                        </button>
                        <button 
                          onClick={() => handleRejectPending(church.id, church.email)}
                          className="flex-1 sm:flex-none px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm font-semibold transition-all shadow-sm"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900/30">
                <Check className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No hay solicitudes nuevas en este momento.</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm h-fit">
            <h3 className="font-serif text-xl mb-6 text-slate-800 dark:text-slate-100 font-bold tracking-tight">Operaciones</h3>
            <div className="space-y-4">
               <div className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-700/50">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20"></div>
                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sistema Global Activo</span>
               </div>
               <div className="flex items-center gap-4 py-4">
                 <div className="w-2.5 h-2.5 rounded-full bg-primary/80 ring-4 ring-primary/20"></div>
                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Respaldos Sincronizados</span>
               </div>
            </div>
          </div>
        </div>

        {/* List of currently registered churches, allowing management */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-serif text-xl mb-6 text-slate-800 dark:text-slate-100 font-bold tracking-tight">Directorio Activo Integrado</h3>
          {registeredChurchesList.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredChurchesList.map((ch) => (
                <div key={ch.id} className="p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl flex justify-between items-start group hover:border-primary/30 transition-colors">
                  <div>
                    <h5 className="font-bold text-base text-slate-900 dark:text-white mb-2">{ch.name}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2"><MapPin className="w-3.5 h-3.5" /> {ch.loc}</p>
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-primary px-2.5 py-1 rounded-md text-[11px] font-semibold">
                      <Users className="w-3.5 h-3.5" /> {ch.members} miembros
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteChurch(ch.id)}
                    className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-500 hover:text-red-500 text-slate-400 rounded-xl transition-all shadow-sm cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Dar de baja comunidad"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900/30">
              <MapPin className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Aún no hay iglesias registradas en el ecosistema.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
