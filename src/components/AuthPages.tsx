import { motion } from 'motion/react';
import React, { useState } from 'react';
import { Mail, Lock, User, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../lib/firebase';

export function AuthFlow({ view, setCurrentView }: { view: 'login' | 'register', setCurrentView: (v: string) => void }) {
  const [isLogin, setIsLogin] = useState(view === 'login');
  const [isAdminReg, setIsAdminReg] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        if (email === 'creador@believe.app') {
          setCurrentView('super-admin-dashboard');
        } else if (localStorage.getItem(`belief-pastor-${email}`)) {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('user-dashboard'); // Podrías tener un flag en la BD para saber si es admin de iglesia
        }
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess('¡Registro exitoso! Hemos enviado un correo de bienvenida a tu bandeja de entrada.');
        
        if (isAdminReg) {
          localStorage.setItem(`belief-pastor-${email}`, 'true');
        }

        setTimeout(() => {
          if (email === 'creador@believe.app') {
            setCurrentView('super-admin-dashboard');
          } else if (isAdminReg) {
            setCurrentView('admin-dashboard');
          } else {
            setCurrentView('user-dashboard');
          }
        }, 3000);
      }
    } catch (err: any) {
      if (err.message.includes('auth/invalid-credential')) {
        setError('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
      } else if (err.message.includes('auth/email-already-in-use')) {
        setError('Este correo electrónico ya está registrado.');
      } else {
        setError('Ocurrió un error. Verifica tu conexión de red y la configuración en .env');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-8 md:p-12 relative"
      >
         <div className="absolute -top-4 right-4 bg-brand-3 text-black text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
           Acceso
         </div>
         <h2 className="font-serif text-3xl font-bold text-brand-1 mb-2">
           {isLogin ? 'Bienvenido de nuevo' : 'Únete a la Comunidad'}
         </h2>
         <p className="font-sans text-sm opacity-70 mb-6 font-light">
           {isLogin ? 'Accede a tu congregación y recursos.' : 'Conecta con tu iglesia local y fortalece tu fe.'}
         </p>

         {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 flex items-start gap-2 text-sm font-sans font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
         )}

         {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-xl mb-6 flex items-start gap-2 text-sm font-sans font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p>{success}</p>
            </div>
         )}

         <form onSubmit={handleSubmit} className="flex flex-col gap-5">
           {!isLogin && (
             <div>
               <label className="text-xs uppercase tracking-widest opacity-60 mb-2 block font-sans">Nombre Completo</label>
               <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                 <input required type="text" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-1 transition-colors text-sm font-sans" placeholder="Tu nombre" />
               </div>
             </div>
           )}
           <div>
              <label className="text-xs uppercase tracking-widest opacity-60 mb-2 block font-sans">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-1 transition-colors text-sm font-sans" placeholder="correo@ejemplo.com" />
              </div>
           </div>
           <div>
              <label className="text-xs uppercase tracking-widest opacity-60 mb-2 block font-sans">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brand-1 transition-colors text-sm font-sans" placeholder="••••••••" />
              </div>
           </div>

           {!isLogin && (
             <label className="flex items-center gap-3 cursor-pointer group mt-2">
               <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center group-hover:border-brand-3/50 transition-colors">
                 <input type="checkbox" className="hidden" checked={isAdminReg} onChange={(e: any) => setIsAdminReg(e.target.checked)} />
                 {isAdminReg && <ShieldCheck className="w-3 h-3 text-brand-3" />}
               </div>
               <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity font-sans">
                 Soy líder / pastor y deseo crear una comunidad (registrar mi iglesia)
               </span>
             </label>
           )}

           <button disabled={loading} type="submit" className="mt-4 disabled:opacity-50 bg-brand-1 hover:bg-brand-2 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-brand-1/20 font-sans cursor-pointer text-center">
             {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarme')}
           </button>

           <div className="mt-4 text-center">
             <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-xs font-sans opacity-60 hover:opacity-100 hover:text-brand-3 transition-colors underline underline-offset-4 cursor-pointer">
               {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
             </button>
           </div>
         </form>
      </motion.div>
    </div>
  );
}
