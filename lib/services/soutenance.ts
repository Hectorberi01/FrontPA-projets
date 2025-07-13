import {fetchProjects} from "@/lib/services/project";
import {getPromotions} from "@/lib/services/promotionService";


export interface Shulder{
    title: string;
    start : Date
    end : Date
    allDay : boolean;
}


const BASE_URL = process.env.NEXT_PUBLIC_SOUTENANCE_URL || "http://localhost:3000/api/soutenances";
export async function generateSoutenanceSchedule(projectId:number) {
    try {
        const response = await fetch(`${BASE_URL}/project/${projectId}`,{
            method: "POST",
        });
        if(response.status === 201){
            return true
        }
        else {
            return false
        }
    }catch(err) {
        console.log(err);
    }
}


export async function showSoutenance() {
    try {
        const promotions  = await getPromotions()

        const data = promotions
            .flatMap((promotion: any) =>
                (promotion.projects || [])
                    .filter((project: any) => !!project.soutenanceDate)
                    .map((project: any) => {
                        const start = new Date(project.soutenanceDate)
                        const end = new Date(start)
                        end.setHours(end.getHours() + 2)

                        return {
                            title: `${project.name} (${promotion.name})`,
                            start,
                            end,
                            allDay: false,
                        }
                    })
            )

        return data
    }catch(err) {
        console.log(err);
    }
}