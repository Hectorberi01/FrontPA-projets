
const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000/api/auth";
export async  function loginData (data: any) {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify(data),
        })
        if(response.status !== 200 && response.status === 401) {
            return null;
        }
        return await response.json()
    }catch(err) {
        console.log("error", err);
    }
}