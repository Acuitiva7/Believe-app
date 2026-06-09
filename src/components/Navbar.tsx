import { motion, useScroll, useTransform } from 'motion/react';
import { Home, Search, LogIn, UserPlus, LogOut, LayoutDashboard, ShieldAlert, MapPin } from 'lucide-react';
import { auth, signOut } from '../lib/firebase';

export function Navbar({ currentView, setCurrentView, user }: any) {
  const { scrollY } = useScroll();
  const isHome = currentView === 'home';

  const handleSignOut = async () => {
    await signOut(auth);
    setCurrentView('home');
  };

  const opacity = useTransform(scrollY, [200, 400], [0, 1]);
  const y = useTransform(scrollY, [200, 400], [-30, 0]);
  const homePointerEvents = useTransform(scrollY, [200, 400], ['none', 'auto']);

  const navOpacity = isHome ? opacity : 1;
  const navY = isHome ? y : 0;
  const pointEvents = isHome ? homePointerEvents : 'auto';

  const isSuperAdmin = user?.email === 'creador@believe.app';

  return (
    <motion.nav
      style={{ opacity: navOpacity, y: navY, pointerEvents: pointEvents as any }}
      className="fixed top-0 left-0 right-0 z-40 px-4 py-4"
    >
      <div className="max-w-6xl mx-auto glass-panel px-6 py-3 flex justify-between items-center shadow-xl">
        <span
          onClick={() => setCurrentView('home')}
          className="font-serif font-bold text-xl text-brand-1 tracking-widest cursor-pointer"
        >
          BELIEVE
        </span>
        <div className="flex items-center gap-2 md:gap-4 flex-wrap text-xs font-sans uppercase tracking-widest font-semibold justify-end">
          <button onClick={() => setCurrentView('home')} className="hidden md:flex items-center gap-1.5 hover:text-brand-2 transition-colors cursor-pointer">
            <Home className="w-4 h-4" /> Inicio
          </button>
          <button onClick={() => setCurrentView('map')} className="hidden md:flex items-center gap-1.5 hover:text-brand-2 transition-colors cursor-pointer">
            <MapPin className="w-4 h-4" /> Directorio Global
          </button>
          <div className="w-px h-4 bg-white/20 hidden md:block mx-1"></div>
          
          {user ? (
            <>
              {isSuperAdmin ? (
                <button onClick={() => setCurrentView('super-admin-dashboard')} className="hover:text-brand-3 text-brand-3 transition-colors flex items-center gap-1 cursor-pointer">
                  <ShieldAlert className="w-4 h-4" /> Super Admin
                </button>
              ) : (
                <button onClick={() => setCurrentView('user-dashboard')} className="hover:text-brand-3 transition-colors flex items-center gap-1 cursor-pointer">
                  <LayoutDashboard className="w-4 h-4" /> Feed
                </button>
              )}
              <button onClick={() => setCurrentView('user-profile')} className="hover:text-brand-3 transition-colors flex items-center gap-2 cursor-pointer bg-black/20 pr-4 pl-1 py-1 rounded-full border border-white/10 ml-2">
                <div className="w-6 h-6 rounded-full bg-brand-1 flex items-center justify-center text-white">
                  <UserPlus className="w-3 h-3 hidden" />
                  {user.email?.[0].toUpperCase() || 'U'}
                </div>
                Perfil
              </button>
              <button onClick={handleSignOut} className="bg-transparent border border-white/20 hover:border-brand-2 text-inherit px-4 py-2 rounded-full transition-colors flex items-center gap-1 cursor-pointer ml-2">
                <LogOut className="w-4 h-4" /> Salir
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setCurrentView('login')} className="hover:text-brand-2 transition-colors flex items-center gap-1 cursor-pointer">
                <LogIn className="w-4 h-4" /> Entrar
              </button>
              <button onClick={() => setCurrentView('register')} className="bg-brand-1 hover:bg-brand-2 text-white px-4 py-2 rounded-full transition-colors flex items-center gap-1 cursor-pointer">
                <UserPlus className="w-4 h-4" /> Registro
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
