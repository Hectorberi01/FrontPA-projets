



const DELIVERABLES_URL = "http://localhost:3000/api/livrables";

export const deliverableService = {
async submitDeliverable(formData: FormData) {
  try {
    const response = await fetch(`${DELIVERABLES_URL}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Erreur lors de la soumission du livrable');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting deliverable:', error);
    throw error;
  }
},


  async fetchProjects() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des projets');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async fetchGroups() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des groupes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  }
};
