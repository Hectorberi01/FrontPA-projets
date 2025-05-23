import * as env from "dotenv";
import { fetchProjectByPromotionId, fetchProjects } from "./project";
env.config();

export async function fecthchGroupes() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_GROUP_URL}/all`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data;
    }catch (error) {
        console.error("Error fetching groupes:", error);
        return [];
    }
}