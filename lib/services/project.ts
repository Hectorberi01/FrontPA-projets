import {CreateProject, Project} from "@/lib/types/projet";
import * as env from "dotenv";
env.config();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function fetchProjects(): Promise<Project[]> {
    try {
        const response = await fetch(`${BASE_URL}/api/projects/list`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

export async function createProject(project: CreateProject) {
    try {
        const res = await fetch(`${BASE_URL}/api/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project),
        });

        if (!res.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await res.json(); // ✅ lire une fois
        console.log("Created new project", data);
        return data;
    }catch(error) {
        console.error("Error creating project:", error);
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

export async function getProjectById(projectId: number) {
    console.log("url", `${BASE_URL}/api/projects/${projectId}`);
    try {
        const response = await fetch(`${BASE_URL}/api/projects/${projectId}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    }catch(error) {
        console.error("Error getting project:", error);
    }
}

export async function deleteProjectAPI(projectId: number) {
    try {
        const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        return { success: true };

    } catch (error) {
        console.error("Error deleting project:", error);
        return { success: false, error };
    }
}