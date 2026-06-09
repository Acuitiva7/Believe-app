import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { WordOfDay } from './components/WordOfDay';
import { CastNet } from './components/CastNet';
import { Categories } from './components/Categories';
import { Promises } from './components/Promises';
import { Community } from './components/Community';
import { Footer } from './components/Footer';
import { Moon, Sun } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { AuthFlow } from './components/AuthPages';
import { UserDashboard, AdminDashboard, SuperAdminDashboard } from './components/Dashboards';
import { ChurchMap } from './components/ChurchMap';
import { UserProfile } from './components/UserProfile';
import { auth, onAuthStateChanged } from './lib/firebase';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('belief-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('belief-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('belief-theme', 'light');
    }
  }, [isDark]);

  return (
    <>
      <div className="bg-gradient-mesh"></div>
      <div className="net-overlay"></div>
      
      <Navbar user={user} currentView={currentView} setCurrentView={setCurrentView} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />
      
      <button 
        onClick={() => setIsDark(!isDark)}
        className="fixed top-24 md:top-6 right-6 z-50 p-3 rounded-full glass-panel glass-panel-hover flex items-center justify-center text-belief-white hover:border-brand-2 transition-colors shadow-xl cursor-pointer"
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="w-5 h-5 text-brand-3" /> : <Moon className="w-5 h-5 text-brand-1" />}
      </button>

      <main className="flex flex-col min-h-screen relative z-10 transition-colors duration-500">
        {currentView === 'home' && (
          <>
            <Hero setCurrentView={setCurrentView} user={user} />
            <WordOfDay />
            <CastNet />
            <Categories />
            <Promises />
            <Community />
          </>
        )}
        {currentView === 'login' && <AuthFlow view="login" setCurrentView={setCurrentView} />}
        {currentView === 'register' && <AuthFlow view="register" setCurrentView={setCurrentView} />}
        {currentView === 'map' && <ChurchMap />}
        {currentView === 'user-profile' && <UserProfile user={user} setCurrentView={setCurrentView} />}
        {currentView === 'user-dashboard' && <UserDashboard user={user} />}
        {currentView === 'admin-dashboard' && <AdminDashboard user={user} />}
        {currentView === 'super-admin-dashboard' && <SuperAdminDashboard user={user} />}
      </main>
      
      {currentView === 'home' && <Footer />}
    </>
  );
}
