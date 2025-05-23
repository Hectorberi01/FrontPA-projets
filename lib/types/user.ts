export interface User {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
}