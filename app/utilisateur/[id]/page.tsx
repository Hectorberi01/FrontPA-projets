import UtilisateurDetailPage from "@/app/utilisateur/[id]/details/page";

interface PageProps {
  params: {
    id: string;
  };
}
export default async function UtilisateurPage({ params }: PageProps) {
  const { id } =  await params;
  return (
      <UtilisateurDetailPage userId={id} />
  )
}