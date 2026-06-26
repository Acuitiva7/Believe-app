import { motion, AnimatePresence } from 'motion/react';
import { Camera, Save, MapPin, CheckCircle2, ShieldAlert, Bell, BellOff, Edit2, LogOut, ChevronRight, Book, Heart, Calendar, Search, ShieldCheck, Settings, User, Lock, Eye, Activity, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { getLocalChurches, Church } from '../data';
import { getUserRole } from '../lib/roles';

export function UserProfile({ user, setCurrentView }: { user?: any; setCurrentView?: (view: string) => void }) {
  const isSuperAdmin = user?.email === 'creador@believe.app';
  const role = getUserRole(user?.email);
  const userId = user?.email || 'default';
  const defaultName = isSuperAdmin ? 'Creador Believe' : 'Usuario Believe';
  
  const [name, setName] = useState(() => localStorage.getItem(`belief-user-name-${userId}`) || defaultName);
  const [username, setUsername] = useState(() => localStorage.getItem(`belief-username-${userId}`) || `@usuario${Math.floor(Math.random() * 1000)}`);
  const [bio, setBio] = useState(() => localStorage.getItem(`belief-user-bio-${userId}`) || 'Buscando crecer en fe y conexión con la iglesia.');
  const [city, setCity] = useState(() => localStorage.getItem(`belief-user-city-${userId}`) || '');
  const [country, setCountry] = useState(() => localStorage.getItem(`belief-user-country-${userId}`) || '');
  const [favoriteVerse, setFavoriteVerse] = useState(() => localStorage.getItem(`belief-user-verse-${userId}`) || '');
  const [spiritualStatus, setSpiritualStatus] = useState(() => localStorage.getItem(`belief-user-status-${userId}`) || 'Creciendo en gracia');
  
  const [church, setChurch] = useState(() => localStorage.getItem(`belief-linked-church-${userId}`) || '');
  const [avatar, setAvatar] = useState(() => localStorage.getItem(`belief-user-avatar-${userId}`) || '');
  const [banner, setBanner] = useState(() => localStorage.getItem(`belief-user-banner-${userId}`) || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem(`belief-notifications-enabled-${userId}`) === 'true');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'perfil' | 'iglesia' | 'configuracion'>('perfil');
  const [showChurchModal, setShowChurchModal] = useState(false);
  const [churchSearchQuery, setChurchSearchQuery] = useState('');
  const [churches, setChurches] = useState<Church[]>(() => getLocalChurches());
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setChurches(getLocalChurches());
  }, []);

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      if (!("Notification" in window)) {
        alert("Tu navegador no soporta notificaciones de escritorio.");
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
      } else {
        alert("Debes permitir las notificaciones en tu navegador para habilitar esta función.");
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem(`belief-user-name-${userId}`, name);
    localStorage.setItem(`belief-username-${userId}`, username);
    localStorage.setItem(`belief-user-bio-${userId}`, bio);
    localStorage.setItem(`belief-user-city-${userId}`, city);
    localStorage.setItem(`belief-user-country-${userId}`, country);
    localStorage.setItem(`belief-user-verse-${userId}`, favoriteVerse);
    localStorage.setItem(`belief-user-status-${userId}`, spiritualStatus);
    localStorage.setItem(`belief-user-avatar-${userId}`, avatar);
    localStorage.setItem(`belief-user-banner-${userId}`, banner);
    localStorage.setItem(`belief-notifications-enabled-${userId}`, String(notificationsEnabled));
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBanner(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleJoinChurch = (churchName: string) => {
    setChurch(churchName);
    localStorage.setItem(`belief-linked-church-${userId}`, churchName);
    localStorage.setItem(`belief-has-linked-church-${userId}`, 'true');
    setShowChurchModal(false);
    alert(`Solicitud enviada a ${churchName}. Al ser aprobada, serás miembro oficial.`);
  };

  const handleLeaveChurch = () => {
    if (confirm("¿Estás seguro de desvincularte de esta iglesia? Dejarás de recibir publicaciones y eventos exclusivos.")) {
      setChurch('');
      localStorage.removeItem(`belief-linked-church-${userId}`);
      localStorage.removeItem(`belief-has-linked-church-${userId}`);
    }
  };

  const filteredChurches = churches.filter(c => c.name.toLowerCase().includes(churchSearchQuery.toLowerCase()) || c.loc.toLowerCase().includes(churchSearchQuery.toLowerCase()));

  return (
    <div className="min-h-screen pt-24 px-4 pb-24 text-foreground font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header & Banner */}
        <div className="glass-panel overflow-hidden mb-8 relative">
          <div className="h-48 md:h-64 bg-gradient-to-r from-brand-1/20 to-brand-3/20 relative group">
            {banner && <img src={banner} alt="Banner" className="w-full h-full object-cover" />}
            <button onClick={() => bannerInputRef.current?.click()} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white backdrop-blur p-2.5 rounded-full transition-all shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer">
              <Camera className="w-4 h-4" />
            </button>
            <input type="file" ref={bannerInputRef} onChange={handleBannerChange} accept="image/*" className="hidden" />
          </div>
          
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 -mt-16 mb-6">
              <div className="relative group shrink-0">
                <div className="w-32 h-32 rounded-full border-4 border-theme-border bg-theme-bg flex items-center justify-center text-foreground font-serif text-4xl overflow-hidden shadow-md cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                  {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-12 h-12 opacity-50" />}
                </div>
                <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-1 right-1 p-2.5 bg-brand-1 text-white rounded-full hover:bg-brand-2 transition-colors cursor-pointer shadow-md border-2 border-theme-border">
                  <Camera className="w-4 h-4" />
                </button>
                <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
              </div>
              
              <div className="flex-1 w-full md:mt-20">
                <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">{name}</h1>
                <p className="text-sm font-medium opacity-70 mb-3">{username}</p>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  {church ? (
                    <button onClick={() => setActiveTab('iglesia')} className="inline-flex items-center gap-1.5 bg-brand-1/10 text-brand-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-brand-1/20 transition-colors cursor-pointer">
                      <ShieldCheck className="w-3.5 h-3.5" /> Miembro de {church}
                    </button>
                  ) : (
                    <button onClick={() => setShowChurchModal(true)} className="inline-flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer">
                      Aún no perteneces a una iglesia
                    </button>
                  )}
                  {spiritualStatus && (
                    <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 px-3 py-1.5 rounded-full text-xs font-semibold">
                      <Activity className="w-3.5 h-3.5" /> {spiritualStatus}
                    </span>
                  )}
                  {(city || country) && (
                    <span className="inline-flex items-center gap-1.5 opacity-70 px-2 py-1.5 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5" /> {city}{city && country ? ', ' : ''}{country}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="w-full md:w-auto flex flex-col items-end gap-3 mt-4 md:mt-20">
                 <button onClick={handleSave} className="bg-brand-1 hover:bg-brand-2 text-white px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto">
                    <Save className="w-4 h-4" /> Guardar
                 </button>
                 <span className="text-[10px] opacity-50 font-semibold uppercase tracking-wider">Se unió en Ene 2026</span>
              </div>
            </div>

            {bio && <p className="opacity-80 text-sm leading-relaxed max-w-3xl mb-4">{bio}</p>}
            {favoriteVerse && (
              <div className="bg-black/5 dark:bg-white/5 border border-theme-border p-4 rounded-2xl max-w-2xl">
                <p className="text-sm font-serif italic opacity-90">"{favoriteVerse}"</p>
                <p className="text-xs opacity-50 mt-2 font-semibold uppercase tracking-wider">Versículo Favorito</p>
              </div>
            )}
            
            <AnimatePresence>
              {saveSuccess && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p>¡Perfil actualizado exitosamente!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-center">
            <span className="text-2xl font-serif font-bold text-foreground">42</span>
            <span className="text-xs opacity-60 font-semibold uppercase tracking-wider mt-1">Días en Believe</span>
          </div>
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-center">
            <span className="text-2xl font-serif font-bold text-foreground flex items-center gap-2"><Book className="w-5 h-5 text-sky-500" /> 18</span>
            <span className="text-xs opacity-60 font-semibold uppercase tracking-wider mt-1">Entradas del Diario</span>
          </div>
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-center">
            <span className="text-2xl font-serif font-bold text-foreground flex items-center gap-2"><Heart className="w-5 h-5 text-rose-500" /> 12</span>
            <span className="text-xs opacity-60 font-semibold uppercase tracking-wider mt-1">Promesas Guardadas</span>
          </div>
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-center">
            <span className="text-2xl font-serif font-bold text-foreground flex items-center gap-2"><Calendar className="w-5 h-5 text-amber-500" /> 3</span>
            <span className="text-xs opacity-60 font-semibold uppercase tracking-wider mt-1">Eventos Asistidos</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-1 sticky top-32">
              <button onClick={() => setActiveTab('perfil')} className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${activeTab === 'perfil' ? 'glass-panel text-brand-1' : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'}`}>
                <User className="w-4 h-4" /> Información Personal
              </button>
              <button onClick={() => setActiveTab('iglesia')} className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${activeTab === 'iglesia' ? 'glass-panel text-brand-1' : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'}`}>
                <ShieldCheck className="w-4 h-4" /> Mi Iglesia
              </button>
              <button onClick={() => setActiveTab('configuracion')} className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${activeTab === 'configuracion' ? 'glass-panel text-brand-1' : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'}`}>
                <Settings className="w-4 h-4" /> Configuración
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 glass-panel p-8 min-h-[400px]">
            {activeTab === 'perfil' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-xl font-serif font-bold text-foreground mb-6">Información Personal</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Nombre Completo</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-theme-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-1/50 transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Nombre de Usuario</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-theme-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-1/50 transition-shadow" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Biografía</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full bg-black/5 dark:bg-white/5 border border-theme-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-1/50 transition-shadow resize-none" placeholder="Cuéntanos un poco sobre ti..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Ciudad</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-theme-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-1/50 transition-shadow" placeholder="Ej: Madrid" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">País</label>
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-theme-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-1/50 transition-shadow" placeholder="Ej: España" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Versículo Favorito (Opcional)</label>
                  <input type="text" value={favoriteVerse} onChange={(e) => setFavoriteVerse(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-theme-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-1/50 transition-shadow" placeholder="Ej: Filipenses 4:13" />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Estado Espiritual (Opcional)</label>
                  <select value={spiritualStatus} onChange={(e) => setSpiritualStatus(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-theme-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-1/50 transition-shadow appearance-none">
                    <option value="">Seleccionar estado...</option>
                    <option value="Sirviendo en mi iglesia">Sirviendo en mi iglesia</option>
                    <option value="En tiempo de oración">En tiempo de oración</option>
                    <option value="Estudiando la Palabra">Estudiando la Palabra</option>
                    <option value="Creciendo en gracia">Creciendo en gracia</option>
                    <option value="Buscando congregación">Buscando congregación</option>
                  </select>
                </div>
              </motion.div>
            )}

            {activeTab === 'iglesia' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-serif font-bold text-foreground mb-6">Mi Iglesia Local</h2>
                
                {church ? (
                  <div className="border border-theme-border rounded-3xl p-8 relative overflow-hidden bg-black/5 dark:bg-white/5">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-1/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                      <div className="w-24 h-24 bg-theme-card-bg rounded-full flex items-center justify-center shadow-sm border border-theme-border shrink-0">
                        <MapPin className="w-8 h-8 text-brand-1" />
                      </div>
                      <div className="text-center md:text-left flex-1">
                        <h3 className="text-2xl font-serif font-bold text-foreground mb-1">{church}</h3>
                        <p className="text-sm opacity-70 mb-4">{churches.find(c => c.name === church)?.loc || 'Comunidad Local'}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          {role === 'pastor' || role === 'lider' ? (
                            <button onClick={() => setCurrentView && setCurrentView('admin-dashboard')} className="bg-brand-1 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-2 transition-colors cursor-pointer shadow-sm">
                              Ir al Panel Administrativo
                            </button>
                          ) : (
                            <span className="bg-black/10 dark:bg-white/10 opacity-80 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
                              Miembro Activo
                            </span>
                          )}
                          <button onClick={handleLeaveChurch} className="bg-transparent border border-red-500/30 text-red-500 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors cursor-pointer shadow-sm">
                            Desvincularme
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-theme-border rounded-3xl bg-black/5 dark:bg-white/5">
                    <div className="w-16 h-16 bg-theme-card-bg rounded-full flex items-center justify-center shadow-sm border border-theme-border mx-auto mb-4">
                      <Search className="w-6 h-6 opacity-50" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Aún no perteneces a una iglesia</h3>
                    <p className="text-sm opacity-70 mb-6 max-w-sm mx-auto">Únete a una congregación para recibir sus publicaciones, eventos exclusivos y conectar con tu comunidad local.</p>
                    <button onClick={() => setShowChurchModal(true)} className="bg-brand-1 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-2 transition-colors cursor-pointer shadow-sm">
                      Buscar Iglesias
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'configuracion' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <section>
                  <h3 className="text-lg font-serif font-bold text-foreground mb-4 flex items-center gap-2"><Lock className="w-5 h-5 opacity-50" /> Privacidad</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-theme-border rounded-2xl">
                      <div>
                        <p className="font-bold text-sm text-foreground">Perfil Público</p>
                        <p className="text-xs opacity-70 mt-0.5">Permitir que otros usuarios vean tu perfil</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-theme-border rounded-2xl">
                      <div>
                        <p className="font-bold text-sm text-foreground">Mostrar Mi Iglesia</p>
                        <p className="text-xs opacity-70 mt-0.5">Mostrar la insignia de tu iglesia en tu perfil</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-serif font-bold text-foreground mb-4 flex items-center gap-2"><Bell className="w-5 h-5 opacity-50" /> Notificaciones</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-theme-border rounded-2xl">
                      <div>
                        <p className="font-bold text-sm text-foreground">Recordatorios de Diario Espiritual</p>
                        <p className="text-xs opacity-70 mt-0.5">Notificaciones diarias para escribir en tu diario</p>
                      </div>
                      <input type="checkbox" checked={notificationsEnabled} onChange={handleToggleNotifications} className="w-4 h-4 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-theme-border rounded-2xl">
                      <div>
                        <p className="font-bold text-sm text-foreground">Anuncios de Mi Iglesia</p>
                        <p className="text-xs opacity-70 mt-0.5">Alertas de nuevas publicaciones de pastores o líderes</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
                    </div>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-lg font-serif font-bold text-foreground mb-4 flex items-center gap-2"><ShieldAlert className="w-5 h-5 opacity-50" /> Seguridad</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-4 border border-theme-border rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                      <p className="font-bold text-sm text-foreground">Cambiar Contraseña</p>
                    </button>
                    <button className="w-full text-left p-4 border border-theme-border rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                      <p className="font-bold text-sm text-foreground">Cerrar Sesiones Activas</p>
                    </button>
                    <button className="w-full text-left p-4 border border-red-500/30 bg-red-500/10 rounded-2xl hover:bg-red-500/20 transition-colors cursor-pointer text-red-500">
                      <p className="font-bold text-sm">Eliminar Cuenta</p>
                    </button>
                  </div>
                </section>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Church Selection Modal */}
      <AnimatePresence>
        {showChurchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowChurchModal(false)}></div>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-theme-bg w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-6 border-b border-theme-border flex justify-between items-center shrink-0">
                <h3 className="text-xl font-serif font-bold text-foreground">Unirme a una Iglesia</h3>
                <button onClick={() => setShowChurchModal(false)} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer opacity-70 hover:opacity-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 bg-black/5 dark:bg-white/5 border-b border-theme-border shrink-0">
                <div className="relative">
                  <input 
                    type="text" 
                    value={churchSearchQuery}
                    onChange={(e) => setChurchSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, ciudad o país..."
                    className="w-full bg-theme-bg border border-theme-border rounded-xl py-3.5 pl-11 pr-5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-1/50 transition-shadow shadow-sm"
                  />
                  <Search className="w-5 h-5 absolute left-4 top-3.5 opacity-50" />
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {filteredChurches.length > 0 ? (
                  <div className="space-y-4">
                    {filteredChurches.map(c => (
                      <div key={c.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 glass-panel hover:border-brand-1/50 transition-colors shadow-sm gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center border border-theme-border shrink-0">
                            <MapPin className="w-5 h-5 text-brand-1" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-foreground">{c.name}</h4>
                            <p className="text-xs opacity-70 mt-1">{c.loc} • {c.members} miembros</p>
                          </div>
                        </div>
                        <button onClick={() => handleJoinChurch(c.name)} className="w-full sm:w-auto bg-foreground hover:opacity-90 text-background px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer shrink-0">
                          Solicitar Unión
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="opacity-70 text-sm">No se encontraron iglesias en tu área.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

