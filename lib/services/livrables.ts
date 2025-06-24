
// lancer le l'anti triche
const BASE_URL = process.env.NEXT_PUBLIC_LIVRABLE_URL|| "http://localhost:3000/api/livrables" ;
export async function similarityCheck(projectId: number){
    try {
        const response = await fetch(`${BASE_URL}/internal/similarity-check/project/${projectId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({})
        })

        return response.status === 200;
    }catch(error){
        console.error(error);
        return false;
    }
}

export async function similarityProject(projectId: number){}

export async function uploadLivrable( formData: FormData){
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_LIVRABLE_URL}`, {
            method: "POST",
            body: formData
        })

        const data = await response.json();
        console.log("data", data);
        if (response.status === 201) {
            return true
        }
        else {
            return false
        }
    }catch(error){
        console.error(error);
        return false;
    }
}