import { useEffect, useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Search, MapPin, Globe, Sparkles, Navigation, Check, AlertTriangle, Info, ArrowRight, Heart } from 'lucide-react';
import { getLocalChurches, Church } from '../data';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

// Check if a key exists, is not a placeholder, and matches the standard Google Maps API key pattern (always starts with AIzaSy)
const hasSufficientKey = Boolean(API_KEY) && 
  API_KEY.trim() !== '' && 
  API_KEY !== 'YOUR_API_KEY' && 
  API_KEY.startsWith('AIzaSy');

export function ChurchMap() {
  const [authError, setAuthError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [churches, setChurches] = useState<Church[]>(() => getLocalChurches());
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [linkedStatus, setLinkedStatus] = useState<string | null>(null);

  // Set initial selected church if available
  useEffect(() => {
    const list = getLocalChurches();
    setChurches(list);
    if (list.length > 0) {
      setSelectedChurch(list[0]);
    }
  }, []);

  // Catch the Google authentication failure dynamically
  useEffect(() => {
    const originalAuthFailure = (window as any).gm_authFailure;
    (window as any).gm_authFailure = () => {
      console.warn("Google Maps authentication failed - displaying beautiful interactive simulation fallback.");
      setAuthError(true);
      if (originalAuthFailure) {
        try {
          originalAuthFailure();
        } catch (e) {
          // ignore
        }
      }
    };

    return () => {
      if (originalAuthFailure) {
        (window as any).gm_authFailure = originalAuthFailure;
      } else {
        delete (window as any).gm_authFailure;
      }
    };
  }, []);

  const handleLinkChurch = (churchName: string) => {
    localStorage.setItem('belief-linked-church', churchName);
    localStorage.setItem('belief-has-linked-church', 'true');
    setLinkedStatus(churchName);
    setTimeout(() => {
      setLinkedStatus(null);
    }, 3000);
  };

  const filteredChurches = churches.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.loc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If a valid key exists and NO GM auth failure has triggered yet, try to load Google Maps safely
  const shouldRenderGoogleMap = hasSufficientKey && !authError;

  return (
    <div className="min-h-screen pt-32 px-4 pb-24 text-belief-white">
      <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">
        
        {/* Encabezado e introducción de la sección */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-5xl text-brand-1 mb-2 font-bold tracking-tight">Iglesias Unidas</h1>
            <p className="font-sans font-light opacity-80 text-sm">Visualiza todas las comunidades de fe, encuentra su ubicación y asóciate a la tuya.</p>
          </div>
        </div>

        {/* Banner informativo suave */}
        {authError && (
          <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-brand-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-amber-500/5">
            <div className="flex gap-3 items-center">
              <AlertTriangle className="w-5 h-5 text-brand-3 shrink-0" />
              <div>
                <p className="font-sans font-semibold text-xs text-brand-3 uppercase tracking-wider">Modo Simulación Activo</p>
                <p className="text-xs opacity-75 font-sans">Se detectó una clave de Google Maps inválida (InvalidKeyMapError). Hemos activado el plano de simulación interactivo de Believe para que continúes sin interrupción.</p>
              </div>
            </div>
          </div>
        )}

        {!hasSufficientKey && (
          <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-brand-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-orange-500/5">
            <div className="flex gap-3 items-center">
              <Info className="w-5 h-5 text-brand-2 shrink-0" />
              <div>
                <p className="font-sans font-semibold text-xs text-brand-2 uppercase tracking-wider">Clave API No Configurada</p>
                <p className="text-xs opacity-75 font-sans">Configura un secreto llamado `GOOGLE_MAPS_PLATFORM_KEY` en la barra de herramientas para desplegar mapas reales. Mientras tanto, puedes explorar hoy el plano interactivo.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Panel Lateral: Lista y buscador de iglesias */}
          <div className="md:col-span-4 flex flex-col gap-5">
            <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
              <h2 className="font-serif text-xl font-bold flex items-center gap-2">
                <Search className="w-5 h-5 text-brand-1" /> Directorio de Iglesias
              </h2>
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar iglesia o ciudad..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-theme-border rounded-xl py-3 px-4 pl-10 text-xs focus:outline-none focus:border-brand-1 transition-colors"
                />
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-3.5 opacity-60" />
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {filteredChurches.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChurch(c)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col gap-1 cursor-pointer ${
                      selectedChurch?.id === c.id 
                        ? 'bg-brand-1/10 border-brand-1 text-belief-white font-medium shadow-md' 
                        : 'bg-black/5 dark:bg-white/5 border-theme-border opacity-80 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="font-bold">{c.name}</span>
                    <span className="opacity-70 flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-brand-2 shrink-0" /> {c.loc}
                    </span>
                  </button>
                ))}
                {filteredChurches.length === 0 && (
                  <p className="text-center py-6 text-xs opacity-60">Ninguna iglesia coincide con la búsqueda.</p>
                )}
              </div>
            </div>

            {/* Detalle de la Iglesia seleccionada */}
            {selectedChurch && (
              <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden bg-gradient-to-br from-brand-1/5 to-transparent">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-1/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
                
                {selectedChurch.logo && (
                  <div className="w-full h-28 rounded-2xl overflow-hidden border border-white/10 relative">
                    <img src={selectedChurch.logo} alt={selectedChurch.name} className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <h3 className="font-serif text-xl font-bold text-brand-1">{selectedChurch.name}</h3>
                  <p className="text-[11px] opacity-70 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-2 shrink-0" /> {selectedChurch.address}
                  </p>
                </div>

                <div className="flex gap-4 text-xs pt-2 border-t border-theme-border">
                  <div>
                    <span className="block opacity-50 text-[10px] uppercase">Región</span>
                    <span className="font-medium">{selectedChurch.loc}</span>
                  </div>
                  <div className="w-px bg-theme-border"></div>
                  <div>
                    <span className="block opacity-50 text-[10px] uppercase">Miembros</span>
                    <span className="font-medium">{selectedChurch.members} asisten</span>
                  </div>
                </div>

                {selectedChurch.mission && (
                  <div className="text-xs pt-2 border-t border-theme-border/50">
                    <span className="block text-[9px] uppercase tracking-wide text-brand-2 font-bold mb-1">Misión</span>
                    <p className="italic opacity-85 font-light leading-relaxed whitespace-pre-line text-zinc-300">"{selectedChurch.mission}"</p>
                  </div>
                )}

                {selectedChurch.vision && (
                  <div className="text-xs pt-2 border-t border-theme-border/50">
                    <span className="block text-[9px] uppercase tracking-wide text-brand-1 font-bold mb-1">Visión</span>
                    <p className="italic opacity-85 font-light leading-relaxed whitespace-pre-line text-zinc-300">"{selectedChurch.vision}"</p>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <button 
                    onClick={() => handleLinkChurch(selectedChurch.name)}
                    className="w-full bg-brand-1 hover:bg-brand-2 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-1/15 cursor-pointer"
                  >
                    {linkedStatus === selectedChurch.name ? (
                      <>
                        <Check className="w-4 h-4 text-white" /> ¡Comunidad Vinculada!
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Vincular a mi Perfil
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-center opacity-65">Al vincularte, verás los anuncios locales de esta comunidad en tu Feed.</span>
                </div>
              </div>
            )}
          </div>

          {/* Panel Principal: El Mapa (Google Maps o Visualización Interactiva) */}
          <div className="md:col-span-8 flex flex-col h-[550px] min-h-[400px]">
            <div className="flex-1 rounded-3xl overflow-hidden glass-panel relative border border-theme-border">
              
              {shouldRenderGoogleMap ? (
                <APIProvider apiKey={API_KEY} version="weekly">
                  <Map
                    defaultCenter={{ lat: 40.4168, lng: -3.7038 }}
                    defaultZoom={12}
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    style={{ width: '100%', height: '100%' }}
                  >
                    {/* Render markers only if coordinate maps match */}
                    {filteredChurches.map(c => {
                      // Adjust coordinate logic based on location dynamically
                      const hash = c.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                      const baseLat = c.loc.toLowerCase().includes('bogota') || c.loc.toLowerCase().includes('co') ? 4.7110 :
                                      c.loc.toLowerCase().includes('mexico') || c.loc.toLowerCase().includes('mx') ? 19.4326 : 40.4168;
                      const baseLng = c.loc.toLowerCase().includes('bogota') || c.loc.toLowerCase().includes('co') ? -74.0721 :
                                      c.loc.toLowerCase().includes('mexico') || c.loc.toLowerCase().includes('mx') ? -99.1332 : -3.7038;
                      const lat = baseLat + (hash % 100 - 50) * 0.002;
                      const lng = baseLng + (hash % 150 - 75) * 0.002;
                      return (
                        <Marker 
                          key={c.id} 
                          position={{ lat, lng }} 
                          title={c.name}
                          onClick={() => setSelectedChurch(c)}
                        />
                      );
                    })}
                  </Map>
                </APIProvider>
              ) : (
                /* Interactive Simulated Vector Map Layout */
                <div className="w-full h-full bg-slate-100 dark:bg-stone-900/60 relative overflow-hidden flex items-center justify-center font-sans">
                  
                  {/* Grid de simulación */}
                  <div className="absolute inset-0 opacity-25" style={{ 
                    backgroundImage: 'linear-gradient(rgba(128,128,128,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.15) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                  }}></div>

                  {/* Curvas artísticas que actúan de autopistas/calzadas de la ciudad */}
                  <svg className="absolute inset-0 w-full h-full text-zinc-300 dark:text-zinc-800 opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-10% 20% C 30% 10%, 40% 70%, 110% 50%" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path d="M40% -10% C 30% 40%, 80% 60%, 50% 110%" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path d="M0% 80% C 50% 70%, 60% 30%, 110% 90%" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>

                  {/* Pines Interactivos en el mapa de simulación */}
                  {filteredChurches.map(c => {
                    const isSelected = selectedChurch?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedChurch(c)}
                        style={{ left: `${c.x}%`, top: `${c.y}%` }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
                      >
                        {/* Efecto de pulso concéntrico */}
                        <span className={`absolute inline-flex rounded-full opacity-75 animate-ping duration-1000 ${
                          isSelected ? 'h-10 w-10 -left-3 -top-3 bg-brand-1/30' : 'h-6 w-6 -left-1 -top-1 bg-brand-2/20'
                        }`}></span>
                        
                        {/* Pin del mapa */}
                        <div className={`relative px-3 py-1.5 rounded-full shadow-lg border transition-all flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-brand-1 border-white text-white scale-110 z-30 font-medium' 
                            : 'bg-white dark:bg-stone-800 border-theme-border text-stone-900 dark:text-zinc-100 scale-95 hover:scale-105 hover:bg-stone-50'
                        }`}>
                          <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-brand-1'}`} />
                          <span className="text-[10px] uppercase font-sans tracking-tight max-w-[80px] truncate">{c.name}</span>
                        </div>
                      </button>
                    );
                  })}

                  {/* Brújula ornamental */}
                  <div className="absolute bottom-6 right-6 p-3 rounded-full bg-white/80 dark:bg-stone-900/85 border border-theme-border flex items-center justify-center opacity-85 shadow">
                    <Navigation className="w-5 h-5 text-brand-1 rotate-45 transform" />
                  </div>

                  {/* Instrucción rápida en la esquina */}
                  <div className="absolute bottom-6 left-6 pr-4 pl-3 py-2 rounded-full bg-white/90 dark:bg-stone-900/90 border border-theme-border flex items-center gap-2 shadow text-[10px] tracking-wide font-medium text-stone-800 dark:text-zinc-200">
                    <Sparkles className="w-3.5 h-3.5 text-brand-3 animate-pulse" /> Haz clic en cualquier pin para ver detalles
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
