import { User } from "../types/user";

const USER_URL = process.env.NEXT_PUBLIC_USER_URL || "http://localhost:3000/api/users";

export async function AllStudents(){
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/students`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.statusText}`);
        }
        //const data = await response.json();
        // const students = data.filter((student:User) => student.role?.name === "student").map((student:User) => ({
        //     id: student.id,
        //     username: student.username,
        //     nom: student.nom,
        //     prenom: student.prenom,
        //     email: student.email,
        //     role: student.role,
        // }));
        return await response.json();
    } catch (error) {
        console.error("Error fetching students:", error);
        throw new Error("Failed to fetch students");
    }
}