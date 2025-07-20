import {CreateProject, Project} from "@/lib/types/projet";
import * as env from "dotenv";
env.config();

const BASE_URL = process.env.NEXT_PUBLIC_PROJET_URL ||"http://localhost:3000/api/projects";

export async function fetchProjects(): Promise<Project[]> {
    try {
        const response = await fetch(`${BASE_URL}`);
        if (response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const projects = data.projects;
        return projects;
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

export async function createProject(project: any,file :File | undefined) {
    console.log("project", project);
    console.log("file", file);
    const formData = new FormData();
    formData.append("project", JSON.stringify(project));
    if (file) {
        formData.append("file", file);
    }
    try {

        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            body: formData,
        });

        if (response.status !== 201) {
            throw new Error("Network response was not ok");
        }
        return true
    }catch(error) {
        console.error("Error creating project:", error);
    }
}

export async function updateProject(project: any,id : number) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project),
        })
        if (response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return await response.json()
    }catch(error) {
        console.error("Error updating project:", error);
    }
}

export async function DeleteProject(projectId: number) {
    try {
        const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
            method: 'DELETE',
        });

        if (response.status !== 200) {
            return { success: false };
        }

        return { success: true };

    } catch (error) {
        console.error("Error deleting project:", error);
        return { success: false, error };
    }
}

export async function getProjectById(projectId: number) {
    console.log("projectId", projectId);
    try {
        const response = await fetch(`${BASE_URL}/${projectId}`);
        if (response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("response", data);
        return data;
    }catch(error) {
        console.error("Error getting project:", error);
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

// ajouter la date de soutenance et le lieu de soutenance

export async function addSoutenance(projectId: number, data: any) {
    console.log("projectId", projectId);
    console.log("data", data);
    console.log("url",`${BASE_URL}/soutenance/${projectId}`);
    try {
        const response = await fetch(`${BASE_URL}/soutenance/${projectId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        const reponseData = await response.json();

        return reponseData;
    }catch (e) {
        console.error("Error adding soutenance:", e);
    }
}



