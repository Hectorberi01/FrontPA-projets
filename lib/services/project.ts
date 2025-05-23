import {Project} from "@/lib/types/projet";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function fetchProjects() {
    try {
        const response = await fetch(`${BASE_URL}/api/projects/list`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data : Project= await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

export async function fetchProjectByPromotionId(promotionId: number) {
    try {
        const response = await fetch(`${BASE_URL}?promotionId=${promotionId}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching project by promotion ID:", error);
        return [];
    }
}