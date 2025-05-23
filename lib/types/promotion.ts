import { Projects } from "./projet";
import { Student } from "./student";

export interface Promotion {
  id: number;
  name: string;
  startYear: Date;
  endYear: Date;
  createdAt: Date;
}

// interface pour créer une promotion
export interface CreatePromotion {
    name: string;
    startYear: Date;
    endYear: Date;
    createdAt?: Date
}

export interface PromotionWithDetails extends Promotion {
    nombreEtudiants: number;
    Students: Student[];
    Projects: Projects[];
}

export interface promotionStudents {
  id: number;
  promotionId: string;
  studentId: string;
}