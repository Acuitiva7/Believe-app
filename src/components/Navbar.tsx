import { motion, useScroll, useTransform } from 'motion/react';
import { Home, MapPin, LogIn, UserPlus, LogOut, LayoutDashboard, ShieldAlert, ShieldCheck } from 'lucide-react';
import { auth, signOut } from '../lib/firebase';
import { Logo } from './Logo';
import { getUserRole, getUserChurchId } from '../lib/roles';

export function Navbar({ currentView, setCurrentView, user }: any) {
  const { scrollY } = useScroll();
  const isHome = currentView === 'home';

  const handleSignOut = async () => {
    await signOut(auth);
    setCurrentView('home');
  };

  const navOpacity = useTransform(scrollY, [100, 200], [0, 1]);
  const navY = useTransform(scrollY, [100, 200], [-30, 0]);
  const homePointerEvents = useTransform(scrollY, [100, 200], ['none', 'auto']);

  const opacity = isHome ? navOpacity : 1;
  const y = isHome ? navY : 0;
  const pointEvents = isHome ? homePointerEvents : 'auto';

  const role = getUserRole(user?.email);
  const churchId = getUserChurchId(user?.email);
  const showAdminPanel = (role === 'pastor' || role === 'lider') && !!churchId;

  return (
    <motion.nav
      style={{ opacity, y, pointerEvents: pointEvents as any }}
      className="fixed top-0 left-0 right-0 z-40 px-4 py-4"
    >
      <div className="max-w-7xl mx-auto glass-panel px-6 py-3 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
        <div className="flex items-center gap-8">
          <span
            onClick={() => setCurrentView('home')}
            className="cursor-pointer flex items-center gap-2 group"
          >
            <Logo className="w-[50px] h-[30px] group-hover:scale-105 transition-transform" />
          </span>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button onClick={() => setCurrentView('home')} className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
              <Home className="w-4 h-4" /> Inicio
            </button>
            <button onClick={() => setCurrentView('map')} className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Directorio
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm font-medium">
          {user ? (
            <>
              {role === 'superadmin' && (
                <button onClick={() => setCurrentView('super-admin-dashboard')} className="text-secondary hover:text-[#2563EB] transition-colors flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <ShieldAlert className="w-4 h-4" /> Super Admin
                </button>
              )}
              
              {showAdminPanel && (
                <button onClick={() => setCurrentView('admin-dashboard')} className="text-amber-600 dark:text-amber-500 hover:text-amber-700 transition-colors flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30">
                  <ShieldCheck className="w-4 h-4" /> {role === 'pastor' ? 'Panel Pastoral' : 'Panel Ministerial'}
                </button>
              )}
              
              <button onClick={() => setCurrentView('user-dashboard')} className="text-slate-600 dark:text-slate-300 hover:text-[#2563EB] transition-colors flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <LayoutDashboard className="w-4 h-4" /> Feed
              </button>
              
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

              <button onClick={() => setCurrentView('user-profile')} className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-full pr-4 pl-1.5 py-1.5 border border-slate-200 dark:border-slate-800 cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user.email?.[0].toUpperCase() || 'U'}
                </div>
                <span className="text-slate-700 dark:text-slate-200 hidden sm:block">Perfil</span>
              </button>
              
              <button onClick={handleSignOut} className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer" title="Cerrar sesión">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setCurrentView('login')} className="text-slate-600 dark:text-slate-300 hover:text-[#2563EB] transition-colors px-4 py-2 rounded-lg font-semibold cursor-pointer">
                Entrar
              </button>
              <button onClick={() => setCurrentView('register')} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg font-semibold cursor-pointer flex items-center gap-2">
                Crear Cuenta <UserPlus className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
