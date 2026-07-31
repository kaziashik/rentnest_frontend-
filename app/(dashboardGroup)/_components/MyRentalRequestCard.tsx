"use client"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IRentalRequest } from "@/lib/types";
import { getStatusBadgeClass } from "@/lib/statusBadge";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { WriteReviewDialog } from "./WriteReviewDialog";
import { PayNowButton } from "./PayNowButton";

type MyRentalRequestCardProps = {
    request: IRentalRequest;
    hasReviewed: boolean;
    hasPaid: boolean;
}

export function MyRentalRequestCard({ request, hasReviewed, hasPaid }: MyRentalRequestCardProps) {
    const [justReviewed, setJustReviewed] = useState(false);

    const showReviewButton = request.status === "ACTIVE" && !hasReviewed && !justReviewed;
    const showPayButton = request.status === "APPROVED" && !hasPaid;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getStatusBadgeClass(request.status)}>
                        {request.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString("en-US")}
                    </span>
                </div>
                <CardTitle className="text-lg">{request.property.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarIcon className="size-3.5" />
                    Move-in: {new Date(request.moveInDate).toLocaleDateString("en-US")}
                </p>

                <p className="line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
                    {request.message}
                </p>

                <div className="flex items-center justify-between text-sm font-semibold">
                    <span>Rent</span>
                    <span>RM{request.property.rentPrice}/mo</span>
                </div>

                {showPayButton && <PayNowButton requestId={request.id} />}

                {showReviewButton && (
                    <WriteReviewDialog
                        propertyId={request.property.id}
                        requestId={request.id}
                        onReviewed={() => setJustReviewed(true)}
                    />
                )}
            </CardContent>
        </Card>
    )
}