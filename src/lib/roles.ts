export type Role = 'usuario' | 'lider' | 'pastor' | 'superadmin';

export function getUserRole(email: string | undefined): Role {
  if (!email) return 'usuario';
  if (email === 'creador@believe.app') return 'superadmin';
  const role = localStorage.getItem(`belief-role-${email}`);
  if (role) return role as Role;
  
  if (localStorage.getItem(`belief-pastor-${email}`)) return 'pastor';
  return 'usuario';
}

export function setUserRole(email: string, role: Role) {
  localStorage.setItem(`belief-role-${email}`, role);
}

export function getUserChurchId(email: string | undefined): string | null {
  if (!email) return null;
  return localStorage.getItem(`belief-linked-church-${email}`);
}
