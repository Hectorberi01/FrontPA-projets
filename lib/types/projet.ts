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
