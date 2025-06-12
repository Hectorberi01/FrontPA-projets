import CreerSoutenancePage from "@/app/soutenances/[projectId]/new/createSoutenace";

interface PageProps {
    params: {
        projectId: string;
    };
}


export default async function newSoutenancePage({ params }: PageProps) {
    const { projectId } =  await params;
    return (
        <CreerSoutenancePage projectId={projectId}/>
    )
}