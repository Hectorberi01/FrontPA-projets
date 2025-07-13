export interface CriteresGrille {
    id?: number;
    titre: string;
    poids: number;
    commentaire?: string;
    individuel: boolean;
}

export interface NoteCritere {
    critereId: number;
    groupeId: number;
    etudiantId?: number;
    note: number;
    commentaire?: string;
}


export type Critere = {
    id: number;
    nom: string;
    poids: number; // en pourcentage
    commentaire?: string;
};

export type Grille = {
    id: number;
    titre: string;
    type: 'livrable' | 'rapport' | 'soutenance';
    projetId: number;
    noteGlobale?: number; // calculée à partir des critères
    criteres: Critere[];
    commentairesGlobaux?: string;
    statut: 'en cours' | 'validée';
};

export const mockGrilles: Grille[] = [
    {
        id: 1,
        titre: "Grille Livrable 1",
        type: "livrable",
        projetId: 1,
        statut: "en cours",
        criteres: [
            { id: 1, nom: "Respect du format", poids: 30 },
            { id: 2, nom: "Contenu technique", poids: 50 },
            { id: 3, nom: "Originalité", poids: 20 },
        ],
    },
    {
        id: 2,
        titre: "Grille Rapport",
        type: "rapport",
        projetId: 1,
        statut: "en cours",
        criteres: [
            { id: 4, nom: "Qualité rédactionnelle", poids: 40 },
            { id: 5, nom: "Structure", poids: 30 },
            { id: 6, nom: "Analyse critique", poids: 30 },
        ],
    },
    {
        id: 3,
        titre: "Grille Soutenance finale",
        type: "soutenance",
        projetId: 1,
        statut: "validée",
        criteres: [
            { id: 7, nom: "Maîtrise du sujet", poids: 40 },
            { id: 8, nom: "Clarté orale", poids: 30 },
            { id: 9, nom: "Réponses aux questions", poids: 30 },
        ],
        noteGlobale: 17.5,
        commentairesGlobaux: "Bonne soutenance, équipe à l’aise à l’oral.",
    },
];

