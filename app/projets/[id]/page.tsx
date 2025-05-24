import ProjetDetailPage from "@/app/projets/[id]/details/ProjetDetailPage";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const id = {params}
  return (
      <ProjetDetailPage projectId={params.id} />
  )
}