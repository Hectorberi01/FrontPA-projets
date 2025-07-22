// lib/services/notation.ts

import { Grille } from "../types/notation";
import { getPromotionByStudentId } from "./promotionService";


const BASE_URL = process.env.NEXT_PUBLIC_NOTATION_URL|| "http://localhost:3000/api/notations"; 

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
  },

    getNotationByGroup : async (projectId: string, groupId: string) => {
    try {

        const response = await fetch(`${BASE_URL}/${projectId}/groups/${groupId}/notation`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        });

        if (!response.ok) {
        throw new Error('Erreur lors de la récupération des notes');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
    },

    getGroupsByProject: async (projectId: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/groups/project/${projectId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        });

        if (!response.ok) {
        throw new Error('Erreur lors de la récupération des groupes');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
    }
,

    getPromotionByStudentIdWithGroups : async (studentId: string) => {
        try {
            const response = await getPromotionByStudentId(Number(studentId));
            
            if (!response) return [];

            // Filtrer pour ne garder que les projets où l'étudiant a un groupe
            const filteredPromotions = response.map((promo: any) => ({
            ...promo,
            projects: promo.projects.filter((project: any) => {
                if (!project.groups || project.groups.length === 0) return false;
                
                // Vérifier si l'étudiant est dans au moins un groupe de ce projet
                return project.groups.some((group: any) => 
                group.groupStudent?.some((gs: any) => gs.studentId === studentId)
                );
            })
            })).filter((promo: any) => promo.projects.length > 0); // Supprimer les promotions sans projets

            return filteredPromotions;
        } catch (error) {
            console.error('Erreur lors de la récupération des promotions avec groupes:', error);
            throw error;
        }
    }
,
    updateGrille: async (grilleId: string, data: Grille) => {
        try {
            const response = await fetch(`${BASE_URL}/grilles/${grilleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la grille');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur:', error);
            throw error;
        }
    }
}