
const BASE_URL = process.env.NEXT_PUBLIC_SOUTENANCE_URL || "http://localhost:3000/api/soutenances";
export async function generateSoutenanceSchedule(projectId:number) {
    try {
        const response = await fetch(`${BASE_URL}/project/${projectId}`,{
            method: "POST",
        });
        if(response.status === 201){
            return true
        }
        else {
            return false
        }
    }catch(err) {
        console.log(err);
    }
}