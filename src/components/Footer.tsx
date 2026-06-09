import { Flame } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-[#1c203b]/90 backdrop-blur-lg border-t border-white/5 py-16 px-4 text-center md:text-left">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 items-center">
        
        <div className="flex justify-center md:justify-start">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2 text-belief-gold">
              <Flame className="w-6 h-6" />
              <span className="font-serif text-2xl font-bold tracking-widest text-belief-white">BELIEF</span>
            </div>
            <p className="text-belief-white/60 font-light text-sm italic">
              "Lanzando redes de fe cada día."
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="font-serif text-belief-gold text-lg mb-2">Lucas 5:1-11</p>
          <div className="h-px w-12 bg-belief-white/10 mb-4"></div>
          <p className="text-xs text-belief-white/40 uppercase tracking-widest">
            Inspiración Divina
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 text-sm font-light text-belief-white/70">
          <a href="#" className="hover:text-belief-gold transition-colors">Inicio</a>
          <a href="#word-of-day" className="hover:text-belief-gold transition-colors">Palabra del Día</a>
          <a href="#journal" className="hover:text-belief-gold transition-colors">Diario Espiritual</a>
          <a href="#" className="hover:text-belief-gold transition-colors">Contacto</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-xs text-belief-white/30 font-light">
        &copy; {currentYear} Believe Digital Experience. Todos los derechos reservados.
      </div>
    </footer>
  );
}
