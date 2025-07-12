import {CreatePromotion, Promotion, PromotionWithDetails} from "../types/promotion";
import {AllStudents} from "./userService";
import * as env from "dotenv";
env.config();

const PROMOTION_SERVER_URL = process.env.NEXT_PUBLIC_PROMOTION_URL || "http://localhost:3000/api/promotions";
const AUTH_URL= process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000/api/auth";
const USER_URL = process.env.NEXT_PUBLIC_USER_URL || "http://localhost:3000/api/user";

export async function createPromotion(promotionData : CreatePromotion, file: File) {
    console.log("Promotion data:", promotionData);
    console.log("File data:", file);
    const formData = new FormData();
    try {
        formData.append("promotion", JSON.stringify(promotionData));
        formData.append("file", file);
        
        const response = await fetch(`${PROMOTION_SERVER_URL}/create`, {
            method: "POST",
            body: formData,
        });

        if (! response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();

    }catch (error) {
        console.error("Error creating promotion:", error);
        //throw new Error("Failed to create promotion");
    }
}

export async function getPromotions() {
    try {
        const response = await fetch(`${PROMOTION_SERVER_URL}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            console.log("Error fetching promotions:");
        }
        const data = await response.json();

        return data;
    } catch (error) {
        console.log("Error fetching promotions:", error);
        throw error;
    }
}

export async function getWithoutStudentPromotions() {
    try {
        const response = await fetch(`${PROMOTION_SERVER_URL}/all`, {
            method: "GET",
            headers: {"Content-Type": "application/json",},
        });
        console.log("response", response);
        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
            //throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Data:", data);

        return data;
    } catch (error) {
        console.error("Error fetching promotions:", error);
        //throw new Error("Failed to fetch promotions");
    }
}


export async function getPromotionById(id: number) {
    console.log('url',`${process.env.NEXT_PUBLIC_PROMOTION_URL}/${id}`);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PROMOTION_URL}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Data:", data);
        const projects = await getProjectByPromotionId(id);
        const students = await AllStudents();

        const promotionStudentsWithUsers = (data.promotionStudents || []).map((ps: any) => {
            const student = students.find((s: any) => s.id === ps.studentId);
            return student || null; 
        }).filter((s: any) => s !== null);

        const promotion: PromotionWithDetails = {
            ...data,
            students: promotionStudentsWithUsers,
            nombreEtudiants: promotionStudentsWithUsers.length,
            projects: projects,
        };
        console.log("Promotion with projects:", promotion);

        return promotion;
    } catch (error) {
        console.error("Error fetching promotion:", error);
        //throw new Error("Failed to fetch promotion");
    }
}

export async function getPromotionByStudentId(id: number) {
    const response = await fetch(`${PROMOTION_SERVER_URL}/students/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (response.status != 200) {
        throw new Error(`Error: ${response.statusText}`);
    }
    if(response.status === 200){
        return response.json();
    }
}

export async function getProjectByPromotionId(id: number) {
    console.log(`${process.env.NEXT_PUBLIC_PROJET_URL}/${id}/promtion`)
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PROJET_URL}/promotion/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
     
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching projects by promotion ID:", error);
        throw new Error("Failed to fetch projects by promotion ID");
    }
}

export async function updatePromotion(id: number, promotionData: Promotion) {
    try {
        const response = await fetch(`${process.env.API_URL}/promotions/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(promotionData),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error updating promotion:", error);
        throw new Error("Failed to update promotion");
    }
}
export async function deletePromotion(id: number) {
    try {
        const response = await fetch(`${PROMOTION_SERVER_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status != 200) {
           return false
        }
        return true;
    } catch (error) {
        console.error("Error deleting promotion:", error);
        throw new Error("Failed to delete promotion");
    }
}
export async function getPromotionByName(name: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/promotions?name=${name}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching promotion by name:", error);
        throw new Error("Failed to fetch promotion by name");
    }
}
export async function  addStudentToPromotion(id: number,student:any) {
    console.log("student:", student);
    try{
        const response = await fetch(`${AUTH_URL}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify(student),
        })

        if (!response.ok) {
            throw new Error(`Erreur lors de l'enregistrement de l'utilisateur : ${response.statusText}`);
        }

        const user = await response.json();

        console.log("user",user);

        // ajouter l'étudiant à la promotion
        const addStudent = await fetch(`${PROMOTION_SERVER_URL}/${id}/students`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                studentId: user.id
            })
        })

        if (!addStudent.ok) {
            const deleteStudent = await fetch(`${USER_URL}/${id}`,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!deleteStudent.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            throw new Error(`Erreur lors de l'ajout à la promotion : ${addStudent.statusText}`);
        }

        return addStudent;

    }catch(error){

    }
}

export async function addStudentWithCSV(promoId: number, formData: FormData) {
    try {
        const response = await fetch(`${PROMOTION_SERVER_URL}/${promoId}/students/csv`, {
            method: "POST",
            body: formData,
        })

        if(response.status != 200) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return response;
    }catch(error){
        console.error("Error deleting student with CSV");
    }
}
