import { Student } from "./student";

export interface Group {
    id: number;
    name: string;
    status: "Complet" | "Complet non" | string; // selon tes status possibles
    createdAt: string; // date en string ISO
    project: Project | null;
    Students: Student[];
  }
  
  export interface Project {
    id: number;
    name: string;
    description: string;
    status: "draft" | "published" | string; // selon tes status possibles
    promotion: Promotion | null;
  }
  
  export interface Promotion {
    id: number;
    name: string;
    startYear: string; // date ISO string
    endYear: string;   // date ISO string
    createdAt: string; // date ISO string
    //promotionStudents: PromotionStudent[];
  }
  
  export interface PromotionStudent {
    id: number;
    promotionId: number;
    studentId: number;
    createdAt: string; // date ISO string
  }
  
//   export interface Student {
//     id: number;
//     username: string;
//     nom: string;
//     prenom: string;
//     email: string;
//     password: string;
//     role: Role;
//   }
  
  export interface Role {
    id: number;
    name: "student" | "admin" | string; // tu peux lister ici tous les rôles possibles
  }