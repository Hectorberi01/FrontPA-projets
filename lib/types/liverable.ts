export interface Project {
  id: number;
  name: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface DeliverableFormData {
  projectId: number;
  groupId: number;
  name: string;
  description: string;
  githubUrl?: string;
  file: File | null;
}
