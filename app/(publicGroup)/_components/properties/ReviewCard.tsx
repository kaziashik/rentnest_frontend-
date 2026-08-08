import { Card, CardContent } from "@/components/ui/card";
import { IReview } from "@/lib/types";
import { StarIcon, UserCircleIcon } from "lucide-react";
import Image from "next/image";

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
                <CardContent className="pb-0 pt-4">
                    <p className="text-base font-semibold">{propertyTitle}</p>
                    {location && <p className="text-xs text-muted-foreground">{location}</p>}
                    {ownerName && <p className="text-xs text-muted-foreground">Landlord: {ownerName}</p>}
                </CardContent>
            )}
            <CardContent className="space-y-2 py-4">
                <div className="flex items-center gap-2">
                    {review.tenant?.photo ? (
                        <Image
                            src={review.tenant.photo}
                            alt={review.tenant.name}
                            width={28}
                            height={28}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <UserCircleIcon className="size-7 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">{review.tenant?.name ?? "Anonymous"}</span>
                </div>

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