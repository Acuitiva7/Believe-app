import { motion, AnimatePresence } from 'motion/react';
import { Camera, Save, MapPin, CheckCircle2, ChevronDown, ShieldAlert, Bell, BellOff } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { getLocalChurches, Church } from '../data';

export function UserProfile({ user, setCurrentView }: { user?: any; setCurrentView?: (view: string) => void }) {
  const isSuperAdmin = user?.email === 'creador@believe.app';
  const defaultName = isSuperAdmin ? 'Creador Believe (Súper Admin)' : 'Usuario Believe';
  const userId = user?.email || 'default';
  const [name, setName] = useState(() => localStorage.getItem(`belief-user-name-${userId}`) || defaultName);
  const [bio, setBio] = useState(() => localStorage.getItem(`belief-user-bio-${userId}`) || 'Buscando crecer en fe y conexión con la iglesia.');
  const [church, setChurch] = useState(() => localStorage.getItem(`belief-linked-church-${userId}`) || 'Centro Cristiano Vida');
  const [avatar, setAvatar] = useState(() => localStorage.getItem(`belief-user-avatar-${userId}`) || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem(`belief-notifications-enabled-${userId}`) === 'true');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showChurchDropdown, setShowChurchDropdown] = useState(false);
  const [churches, setChurches] = useState<Church[]>(() => getLocalChurches());
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setName(localStorage.getItem(`belief-user-name-${userId}`) || defaultName);
    setBio(localStorage.getItem(`belief-user-bio-${userId}`) || 'Buscando crecer en fe y conexión con la iglesia.');
    setChurch(localStorage.getItem(`belief-linked-church-${userId}`) || 'Centro Cristiano Vida');
    setAvatar(localStorage.getItem(`belief-user-avatar-${userId}`) || '');
    setNotificationsEnabled(localStorage.getItem(`belief-notifications-enabled-${userId}`) === 'true');
  }, [userId, defaultName]);

  useEffect(() => {
    setChurches(getLocalChurches());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowChurchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    localStorage.setItem(`belief-user-bio-${userId}`, bio);
    localStorage.setItem(`belief-linked-church-${userId}`, church);
    localStorage.setItem(`belief-user-avatar-${userId}`, avatar);
    localStorage.setItem(`belief-has-linked-church-${userId}`, 'true');
    localStorage.setItem(`belief-notifications-enabled-${userId}`, String(notificationsEnabled));
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredChurches = churches.filter(c => c.name.toLowerCase().includes(church.toLowerCase()));

  return (
    <div className="min-h-screen pt-32 px-4 pb-24 text-belief-white">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 md:p-12 rounded-3xl">
          <h1 className="font-serif text-3xl mb-8 text-brand-1 font-bold tracking-tight">Mi Perfil</h1>

          <AnimatePresence>
            {saveSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl mb-6 flex items-center gap-2 text-sm font-sans font-medium"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p>¡Perfil guardado y actualizado exitosamente!</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-2 border-brand-1/50 flex items-center justify-center bg-brand-1/10 text-brand-1 font-serif text-4xl overflow-hidden shadow-inner cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  name ? name.charAt(0).toUpperCase() : 'U'
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-3 bg-brand-1 text-white rounded-full hover:bg-brand-2 transition-colors cursor-pointer shadow-md"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
            
            <div className="flex-1 space-y-5 w-full">
              <div>
                <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Nombre Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-theme-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-1 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest opacity-60 mb-2 font-bold">Biografía</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-black/5 dark:bg-white/5 border border-theme-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-1 transition-colors resize-none"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-theme-border space-y-5 mb-8">
            <h3 className="font-serif text-xl text-brand-2 font-bold">Mi Congregación</h3>
            <p className="text-sm opacity-70 mb-4 tracking-wide font-light">Asocia tu perfil a una iglesia para recibir actualizaciones, eventos y mensajes de tus pastores.</p>
            
            <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between border-brand-2/30 gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-brand-2/20 flex items-center justify-center text-brand-2 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{church || 'Ninguna seleccionada'}</h4>
                  <span className="text-xs opacity-60">Iglesia Principal</span>
                </div>
              </div>
              <div className="relative w-full md:w-[250px]" ref={dropdownRef}>
                <div className="relative">
                  <input 
                    type="text" 
                    value={church} 
                    onChange={(e) => {
                      setChurch(e.target.value);
                      setShowChurchDropdown(true);
                    }}
                    onFocus={() => setShowChurchDropdown(true)}
                    placeholder="Busca tu iglesia..."
                    className="w-full bg-black/5 dark:bg-white/5 border border-theme-border rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:border-brand-2"
                  />
                  <ChevronDown className="w-4 h-4 absolute right-2 top-2 opacity-50" />
                </div>

                <AnimatePresence>
                  {showChurchDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-stone-900 border border-theme-border rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto"
                    >
                      {filteredChurches.length > 0 ? (
                        filteredChurches.map((c) => (
                          <div 
                            key={c.id} 
                            onClick={() => {
                              setChurch(c.name);
                              setShowChurchDropdown(false);
                            }}
                            className="p-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer border-b border-theme-border/50 last:border-0"
                          >
                            <p className="font-bold text-xs">{c.name}</p>
                            <p className="text-[10px] opacity-60 flex items-center gap-1 mt-0.5"><MapPin className="w-2.5 h-2.5" />{c.loc}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-xs opacity-60 text-center">No se encontraron iglesias</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-theme-border space-y-5 mb-8">
            <h3 className="font-serif text-xl text-brand-2 font-bold">Notificaciones y Recordatorios</h3>
            <p className="text-sm opacity-70 mb-4 tracking-wide font-light">Configura alertas diarias para mantener tu conexión espiritual activa.</p>
            
            <div className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between border-brand-2/30 gap-4">
              <div className="flex items-center gap-4 w-full">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${notificationsEnabled ? 'bg-brand-1/20 text-brand-1' : 'bg-black/10 dark:bg-white/10 opacity-60'}`}>
                  {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Recordatorio Diario (9:00 AM)</h4>
                  <p className="text-xs opacity-60 mt-0.5">Recibe una alerta para revisar la Palabra del Día y tu Diario Espiritual.</p>
                </div>
              </div>
              <button 
                onClick={handleToggleNotifications}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all whitespace-nowrap ${
                  notificationsEnabled 
                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20' 
                    : 'bg-brand-1 text-white hover:bg-brand-2 shadow-md'
                }`}
              >
                {notificationsEnabled ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>

          {isSuperAdmin && setCurrentView && (
            <div className="mt-8 pt-8 border-t border-theme-border/50">
              <div className="bg-brand-3/10 border border-brand-3/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldAlert className="w-6 h-6 text-brand-3" />
                  <h3 className="font-serif text-lg font-bold text-brand-3 uppercase tracking-wide">Panel de Control de Creador</h3>
                </div>
                <p className="text-xs opacity-70 mb-5 max-w-xl font-sans leading-relaxed">
                  Como creador y súper administrador del backend, tienes privilegios plenos para registrar nuevas iglesias, aprobar congregaciones asociadas y emitir boletines de anuncios globales oficiales.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setCurrentView('super-admin-dashboard')}
                    className="bg-brand-3 hover:bg-brand-3/80 text-black px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
                  >
                    Abrir Consola de Administración
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6 mt-8 border-t border-theme-border">
            <button 
              onClick={handleSave}
              className="bg-brand-1 hover:bg-brand-2 text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Guardar Cambios
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
