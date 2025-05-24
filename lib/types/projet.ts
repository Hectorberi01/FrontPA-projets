import {Promotion} from "@/lib/types/promotion";
import {Group} from "@/lib/types/groupe";

export interface Projects {
  id: number;
  name: string;
  description: string;
  status: string;
  promotionId: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  soutenanceDate: string | null;
  minStudents: number;
  maxStudents: number;
  mode: 'manual' | 'random' | 'free';
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'visible';
  promotionId: number;
}

export type CreateProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type groupe = Omit<Group, 'Projects'|'Students'>
export interface PorjectDetails extends Project {
  promotions : Promotion
  groups : Group[]
}
export interface livrable{
  id: number;
  projectId: number;
  name: string;
}
