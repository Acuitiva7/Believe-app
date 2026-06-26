import { Flame } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-white border-t border-slate-200 py-16 px-4 text-center md:text-left font-sans">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 items-center">
        
        <div className="flex justify-center md:justify-start">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2 text-primary">
              <Flame className="w-6 h-6" />
              <span className="font-serif text-2xl font-bold tracking-widest text-slate-900">BELIEVE</span>
            </div>
            <p className="text-slate-500 font-medium text-sm italic">
              "Lanzando redes de fe cada día."
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="font-serif font-bold text-slate-900 text-lg mb-2">Lucas 5:1-11</p>
          <div className="h-px w-12 bg-slate-200 mb-4"></div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Comunidad Digital
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 text-sm font-semibold text-slate-500">
          <a href="#" className="hover:text-primary transition-colors">Inicio</a>
          <a href="#word-of-day" className="hover:text-primary transition-colors">Palabra del Día</a>
          <a href="#journal" className="hover:text-primary transition-colors">Directorio</a>
          <a href="#" className="hover:text-primary transition-colors">Contacto</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-slate-100 text-center text-xs text-slate-400 font-medium uppercase tracking-wider">
        &copy; {currentYear} Believe. Todos los derechos reservados.
      </div>
    </footer>
  );
}
