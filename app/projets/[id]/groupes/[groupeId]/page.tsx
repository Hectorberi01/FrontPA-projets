import GroupeDetailsPage from "./details/groupeDetails"
interface PageProps {
    params: {
        id: string;
        groupeId: string;
    };
}
export default async function ({params}: PageProps){
    const data = await params;
    console.log("params",data)
    return (
        <GroupeDetailsPage params={data} />
    )
}