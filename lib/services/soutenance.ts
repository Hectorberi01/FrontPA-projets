
const BASE_URL = process.env.NEXT_PUBLIC_SOUTENANCE_URL || "http://localhost:3000/api/soutenances";
export async function generateSoutenanceSchedule(data:any) {
    try {
        const response = await fetch(`${BASE_URL}`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if(response.status === 200){
            return await response.json();
        }
    }catch(err) {
        console.log(err);
    }
}