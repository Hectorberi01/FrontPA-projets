
const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000/api/auth";
export async  function login (data: any) {
    console.log("data", data);
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        //console.log("response", await response.json())
        if(response.status !== 200){
            return false;
        }
        const user = await response.json(); // ✅ on attend ici
        localStorage.setItem("user", JSON.stringify(user));
        return true
    }catch(err) {
        console.log("error", err);
    }
}