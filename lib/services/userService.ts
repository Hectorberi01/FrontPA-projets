import {getPromotions, getWithoutStudentPromotions} from "@/lib/services/promotionService";

const USER_URL = process.env.NEXT_PUBLIC_USER_URL || "http://localhost:3000/api/users";
const PROMOTION_SERVER_URL = process.env.NEXT_PUBLIC_PROMOTION_URL || "http://localhost:3000/api/promotions";


export async function getAll(){
    try {
        const responseUser = await fetch(`${USER_URL}`, {
            method: "GET",
            headers: {"Content-Type": "application/json",},
        })
        if (responseUser.status !== 200) {
            throw new Error(responseUser.statusText);
        }
        const users = await responseUser.json();
        const promotions = await getWithoutStudentPromotions()

        console.log("promotions", promotions)

        return users.map((user: any) => {
            const userPromo = promotions.find((promo: any) =>
                promo.promotionStudents?.some((ps: any) => ps.studentId === user.id)
            );
            return {
                id: user.id,
                nom:user.nom,
                prenom: user.prenom,
                username: user.username,
                email: user.email,
                role: user.role?.name || "-",
                promotion: userPromo?.name || "-",
                statut: user.isActive ? "Actif" : "Inactif",
                derniereConnexion: user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleDateString("fr-FR")
                    : "-",
                dateCreation: user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("fr-FR")
                    : "-",
            };
        });

    }catch (error) {
        console.error(error);
        return [];
    }
}

export async function CreateUser(data: any) {
    const isStudent = data.promotionId !== undefined && data.promotionId !== null && data.promotionId !== "";

    const payload: any = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        roleId: parseInt(data.roleId),
        isActive: data.statut,
        phoneNumber: data.telephone || null,
        adresse: data.adresse || null,
    };

    if (isStudent) {
        const response = await fetch(`${USER_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })

        if (response.status !== 201) {
            throw new Error(" cant not create User");
        }

        const user = await response.json();

        // ajouter l'étudiant à la promotion
        const promotionId = parseInt(data.promotionId);
        const addStudent = await fetch(`${PROMOTION_SERVER_URL}/${promotionId}/students`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                studentId: user.id
            })
        })
        if(addStudent.status !== 200){
            throw new Error(addStudent.statusText);
        }

        if(addStudent.status === 200 && response.status=== 201){
            return true
        }
        return false;
    }else {

        const response = await fetch(`${USER_URL}`, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify(payload),
        })

        if (response.status !== 201) {throw new Error(" cant not create User");}

        if(response.status === 201) {return true}
        else {return false;}
    }
}
export async function AllStudents(){
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        const students = data.filter((student:any) => student.role?.name === "student".toUpperCase()).map((student:any) => ({
            id: student.id,
            username: student.username,
            nom: student.nom,
            prenom: student.prenom,
            email: student.email,
            role: student.role,
        }));
        return students;
    } catch (error) {
        console.error("Error fetching students:", error);
        throw new Error("Failed to fetch students");
    }
}