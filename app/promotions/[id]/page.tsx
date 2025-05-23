import PromotionDetailsPage from "./details/DetailsPromotion";

export default function PromotionPage({ params }: { params: { id: string } }) {
    const { id } = params;
    return (
        <PromotionDetailsPage promotionId={id} />
    )
}