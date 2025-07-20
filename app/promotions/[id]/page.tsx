import PromotionDetailsPage from "./details/DetailsPromotion";

export default async function PromotionPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <PromotionDetailsPage promotionId={id} />
    )
}