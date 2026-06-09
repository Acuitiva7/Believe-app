export const dailyWord = {
  verse: "Pero por tu palabra echaré la red.",
  reference: "Lucas 5:5",
  reflection: "A menudo nos encontramos al límite de nuestras fuerzas y lógica humana, como Pedro tras una noche sin pesca. Sin embargo, un solo acto de obediencia a la voz de Dios puede desencadenar un milagro inesperado.",
};

export const responsesForNet = [
  {
    verse: "Acerquémonos, pues, confiadamente al trono de la gracia, para alcanzar misericordia y hallar gracia para el oportuno socorro.",
    reference: "Hebreos 4:16",
    reflection: "No importa lo que te preocupe hoy, Su gracia está lista para recibirte."
  },
  {
    verse: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.",
    reference: "Isaías 41:10",
    reflection: "La incertidumbre puede ser paralizante, pero no caminas en soledad."
  },
  {
    verse: "Encomienda a Jehová tu camino, y confía en él; y él hará.",
    reference: "Salmos 37:5",
    reflection: "Lanzar la red es un acto de rendición. Deja el resultado en Sus manos."
  },
  {
    verse: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien...",
    reference: "Romanos 8:28",
    reflection: "Incluso cuando el agua parece vacía, Él está tejiendo algo mayor a tu favor."
  }
];

export const promiseCards = [
  { id: 1, title: "Dios está contigo", text: "No te dejaré, ni te desampararé.", ref: "Josué 1:5" },
  { id: 2, title: "No temas", text: "Porque yo Jehová soy tu Dios, quien te sostiene de tu mano derecha.", ref: "Isaías 41:13" },
  { id: 3, title: "Todo obra para bien", text: "A los que aman a Dios, todas las cosas les ayudan a bien.", ref: "Romanos 8:28" },
  { id: 4, title: "Nueva Fuerza", text: "Los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.", ref: "Isaías 40:31" },
];

export const mockTestimonials = [
  {
    id: 1,
    name: "María Fernández",
    handle: "@mariaf_fe",
    content: "Llevaba meses frustrada en mi trabajo. Anoche decidí soltar el control y 'volver a lanzar la red'. Hoy me desperté con una paz inmensa que sobrepasa todo entendimiento.",
    time: "Hace 2h"
  },
  {
    id: 2,
    name: "David Ruiz",
    handle: "@davidr",
    content: "La palabra de hoy conectó exactamente con lo que estoy viviendo. Dios llega justo a tiempo, cuando la lógica ya no alcanza.",
    time: "Hace 5h"
  },
  {
    id: 3,
    name: "Ana Lucía",
    handle: "@analu",
    content: "El ejercicio de 'lanzar mi red' me ayudó a rendir una preocupación familiar que llevaba cargando sola. Confianza total en Él. 🙏✨",
    time: "Hace 1 día"
  }
];

export const categories = [
  { id: 'fe', name: 'Fe', icon: 'Sparkles' },
  { id: 'esperanza', name: 'Esperanza', icon: 'Sun' },
  { id: 'fortaleza', name: 'Fortaleza', icon: 'Shield' },
  { id: 'amor', name: 'Amor', icon: 'Heart' },
  { id: 'sabiduria', name: 'Sabiduría', icon: 'BookOpen' },
  { id: 'gratitud', name: 'Gratitud', icon: 'Coffee' },
  { id: 'paz', name: 'Paz', icon: 'Wind' },
];

// Persistence Helpers for Churches
export interface Church {
  id: string;
  name: string;
  loc: string; // e.g. "Madrid, ES"
  address: string;
  members: number;
  x: number; // coordinate for simulation layout (20 - 80)
  y: number; // coordinate for simulation layout (20 - 80)
  logo?: string; // Base64 data URL or unsplash URL
  mission?: string; // Misión de la iglesia
  vision?: string; // Visión de la iglesia
  pastors?: string; // Pastores de la iglesia
  status?: 'pending' | 'approved' | 'rejected'; // Estado
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'global' | 'local';
  churchName?: string;
  author: string;
  date: string;
  likes: number;
  comments: { author: string; text: string; date: string }[];
}

export function getLocalChurches(): Church[] {
  try {
    const list = localStorage.getItem('belief-churches');
    return list ? JSON.parse(list) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalChurches(churches: Church[]) {
  localStorage.setItem('belief-churches', JSON.stringify(churches));
}

export function addLocalChurch(church: Omit<Church, 'id' | 'x' | 'y'>): Church {
  const churches = getLocalChurches();
  const newChurch: Church = {
    ...church,
    id: 'church_' + Date.now(),
    x: Math.floor(Math.random() * 60) + 20, // Keep in bounds 20-80
    y: Math.floor(Math.random() * 60) + 20,
  };
  churches.push(newChurch);
  saveLocalChurches(churches);
  return newChurch;
}

// Ensure SIMULATED_CHURCHES is exported for compatibility, loading dynamically
export const SIMULATED_CHURCHES: Church[] = [];

// Persistence Helpers for Announcements
export function getLocalAnnouncements(): Announcement[] {
  try {
    const list = localStorage.getItem('belief-announcements');
    if (list) return JSON.parse(list);
    
    // Default system announcements if empty
    const defaults: Announcement[] = [
      {
        id: 'ann_default_1',
        title: '¡Bienvenidos a la plataforma Believe! 🎉',
        content: 'Nos alegra mucho que te unas a esta gran red. Recuerda buscar tu iglesia local en la sección correspondiente para unirte a tu comunidad, y configurar tu perfil para conectarte mejor.',
        category: 'global',
        author: 'Administración Global',
        date: 'Hace 2 horas',
        likes: 12,
        comments: [
          { author: 'María S.', text: '¡Qué bendición contar con esta herramienta!', date: 'Hace 1 hora' }
        ]
      }
    ];
    localStorage.setItem('belief-announcements', JSON.stringify(defaults));
    return defaults;
  } catch (e) {
    return [];
  }
}

export function saveLocalAnnouncements(announcements: Announcement[]) {
  localStorage.setItem('belief-announcements', JSON.stringify(announcements));
}

export function addLocalAnnouncement(ann: Omit<Announcement, 'id' | 'likes' | 'comments'>): Announcement {
  const announcements = getLocalAnnouncements();
  const newAnn: Announcement = {
    ...ann,
    id: 'ann_' + Date.now(),
    likes: 0,
    comments: []
  };
  announcements.unshift(newAnn); // Add newest first
  saveLocalAnnouncements(announcements);
  return newAnn;
}

