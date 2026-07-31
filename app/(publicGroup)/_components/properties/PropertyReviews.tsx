import { IPropertyReviewsData } from "@/lib/types";
import { getPropertyReviews } from "../../_actions/getPropertyReviews";
import { ReviewCard } from "./ReviewCard";

type PropertyReviewsProps = {
    propertyId: string;
}

export async function PropertyReviews({ propertyId }: PropertyReviewsProps) {
    const result = await getPropertyReviews(propertyId);

    if (!result.success) {
        return (
            <div>
                <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
                <p className="py-6 text-center text-sm text-muted-foreground">
                    Log in to view reviews for this property.
                </p>
            </div>
        );
    }

    const { reviews, totalCount, averageRating }: IPropertyReviewsData = result.data;

    if (!reviews.length) {
        return (
            <div>
                <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
                <p className="py-6 text-center text-sm text-muted-foreground">
                    No reviews yet for this property.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Reviews</h2>
                <span className="text-sm text-muted-foreground">
                    {averageRating.toFixed(1)} ★ ({totalCount} {totalCount === 1 ? "review" : "reviews"})
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>
        </div>
    );
}