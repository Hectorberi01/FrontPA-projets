import * as env from "dotenv";
import { fetchProjectByPromotionId, fetchProjects } from "./project";
env.config();

export async function fecthGroupes() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_GROUP_URL}`);
        if (response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    }catch (error) {
        console.error("Error fetching groupes:", error);
        return [];
    }
}

export async function fecthGroupeById(id: number) {
    console.log(`Fetching groupes with id ${id}`);
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_GROUP_URL}/${id}`)
        console.log("usl", `${process.env.NEXT_PUBLIC_GROUP_URL}/${id}`)
        console.log(response);
        if (response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        return data;
    }catch (error) {
        console.error("Error fetching groupe id:", id);
    }
}

export async function addStudentToGroup(id: number, studentId: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_GROUP_URL}/addStudent`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            groupId: id,
            studentId: studentId,
        })
    })
    if (response.status !== 200) {
        throw new Error("Network response was not ok");
    }
    return await response.json();
}