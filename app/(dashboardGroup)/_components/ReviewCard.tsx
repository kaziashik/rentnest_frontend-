import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IReview } from "@/lib/types";
import { StarIcon, MapPinIcon, UserIcon } from "lucide-react";

type ReviewCardProps = {
    review: IReview;
    propertyTitle?: string;
    location?: string;
    ownerName?: string;
}

export function ReviewCard({ review, propertyTitle, location, ownerName }: ReviewCardProps) {
    return (
        <Card>
            {propertyTitle && (
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">{propertyTitle}</CardTitle>
                    {location && (
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPinIcon className="size-3" />
                            {location}
                        </p>
                    )}
                    {ownerName && (
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <UserIcon className="size-3" />
                            Landlord: {ownerName}
                        </p>
                    )}
                </CardHeader>
            )}
            <CardContent className="space-y-2 py-4">
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                            key={i}
                            className={`size-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                    ))}
                </div>
                <p className="text-sm">{review.comment}</p>
                <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-US")}
                </p>
            </CardContent>
        </Card>
    )
}