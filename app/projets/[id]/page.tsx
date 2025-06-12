import ProjetDetailPage from "@/app/projets/[id]/details/ProjetDetailPage";

interface PageProps {
  params: {
    id: string;
  };
}
export default async function ProjectPage({ params }: PageProps) {
  const { id } =  await params;
  return (
      <ProjetDetailPage projectId={id} />
  )
}