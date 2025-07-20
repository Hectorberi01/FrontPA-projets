// lib/services/notation.ts


const BASE_URL = process.env.NEXT_PUBLIC_NOTATION_URL|| "http://localhost:3000/api/notations"; ;

export const gradingApi = {


  // Récupérer les grilles d'un projet
  getProjectGrilles: async (projectId: string) => {
    const response = await fetch(`${BASE_URL}/${projectId}/grilles`);
    return response.json();
  },

  // Récupérer la notation existante d'un groupe
  getGroupNotation: async (projectId: string, groupId: string) => {
    const response = await fetch(`${BASE_URL}/${projectId}/groups/${groupId}/notation`);
    return response.json();
  },

  // Sauvegarder une note de critère
  saveNoteForCritere: async (projectId: string, groupId: string, data: {
    grilleId: string;
    critereId: number;
    note?: number;
    commentaire?: string;
    studentId?: number;
  }) => {
    const response = await fetch(`${BASE_URL}/${projectId}/groups/${groupId}/notation/critere`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Sauvegarder un commentaire global pour une grille
  saveGlobalComment: async (projectId: string, groupId: string, data: {
    grilleId: string;
    commentaire: string;
  }) => {
    const response = await fetch(`${BASE_URL}/${projectId}/groups/${groupId}/notation/commentaire-global`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Valider une grille spécifique
  validateGrille: async (projectId: string, groupId: string, grilleId: string) => {
    const response = await fetch(`${BASE_URL}/${projectId}/groups/${groupId}/notation/grilles/${grilleId}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  // Finaliser la notation complète
  finalizeNotation: async (projectId: string, groupId: string, data: {
    notes: any;
    commentairesGlobaux: Record<string, string>;
    commentaireProjet: string;
  }) => {
    console.log("Finalizing notation with data:", data);
    console.log("Project ID:", projectId, "Group ID:", groupId);
    
    const response = await fetch(`${BASE_URL}/${projectId}/groups/${groupId}/notation/finalize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Publier les notes (rendre visibles aux étudiants)
  publishGrades: async (projectId: string) => {
    const response = await fetch(`${BASE_URL}/${projectId}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }
};