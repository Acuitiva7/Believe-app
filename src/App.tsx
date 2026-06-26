import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { WordOfDay } from './components/WordOfDay';
import { CastNet } from './components/CastNet';
import { Categories } from './components/Categories';
import { Promises } from './components/Promises';
import { Community } from './components/Community';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AuthFlow } from './components/AuthPages';
import { UserDashboard, AdminDashboard, SuperAdminDashboard } from './components/Dashboards';
import { ChurchMap } from './components/ChurchMap';
import { UserProfile } from './components/UserProfile';
import { auth, onAuthStateChanged } from './lib/firebase';

function useDailyNotification() {
  useEffect(() => {
    const checkNotification = () => {
      const enabled = localStorage.getItem('belief-notifications-enabled') === 'true';
      if (!enabled) return;
      if (!("Notification" in window) || Notification.permission !== 'granted') return;

      const now = new Date();
      const today = now.toLocaleDateString();
      const lastShown = localStorage.getItem('belief-last-notification-date');

      // Check if it's 9 AM or later, and we haven't shown it today
      if (lastShown !== today && now.getHours() >= 9) {
        try {
          new Notification('¡Buenos días!', {
            body: 'Recuerda revisar la Palabra del Día y tu Diario Espiritual.',
            icon: '/logo.png'
          });
          localStorage.setItem('belief-last-notification-date', today);
        } catch (e) {
          console.error('Error showing notification:', e);
        }
      }
    };

    // Check immediately and then every minute
    checkNotification();
    const interval = setInterval(checkNotification, 60000);
    return () => clearInterval(interval);
  }, []);
}

import { CategoryView } from './components/CategoryView';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState<any>(null);

  useDailyNotification();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="bg-gradient-mesh opacity-50"></div>
      <div className="net-overlay opacity-30"></div>
      
      <Navbar user={user} currentView={currentView} setCurrentView={setCurrentView} />

      <main className="flex flex-col min-h-screen relative z-10">
        {currentView === 'home' && (
          <>
            <Hero setCurrentView={setCurrentView} user={user} />
            <WordOfDay />
            <CastNet />
            <Categories setCurrentView={setCurrentView} />
            <Promises />
            <Community user={user} />
          </>
        )}
        {currentView === 'login' && <AuthFlow view="login" setCurrentView={setCurrentView} />}
        {currentView === 'register' && <AuthFlow view="register" setCurrentView={setCurrentView} />}
        {currentView === 'map' && <ChurchMap />}
        {currentView === 'user-profile' && <UserProfile user={user} setCurrentView={setCurrentView} />}
        {currentView === 'user-dashboard' && <UserDashboard user={user} />}
        {currentView === 'admin-dashboard' && <AdminDashboard user={user} />}
        {currentView === 'super-admin-dashboard' && <SuperAdminDashboard user={user} />}
        {currentView.startsWith('category-') && <CategoryView categoryId={currentView.split('-')[1]} setCurrentView={setCurrentView} />}
      </main>
      
      {currentView === 'home' && <Footer />}
    </>
  );
}
