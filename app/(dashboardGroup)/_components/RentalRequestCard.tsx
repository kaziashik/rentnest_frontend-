"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IRentalRequest } from "@/lib/types";
import { CalendarIcon, MailIcon, CheckIcon, XIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateRentalStatus } from "../_actions/updateRentalStatus";

type RentalRequestCardProps = {
    request: IRentalRequest;
}

export function RentalRequestCard({ request }: RentalRequestCardProps) {
    const [isPending, startTransition] = useTransition();

    const handleStatusChange = (status: string) => {
        startTransition(async () => {
            const result = await updateRentalStatus(request.id, status);
            // console.log("check request statas",result);

            if (result.success) {
                toast.success(result.message || "Request status updated successfully");
            } else {
                toast.error(result.message || "Something went wrong");
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Badge variant={request.status === "ACTIVE" ? "outline" : "default"}>
                        {request.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString("en-US")}
                    </span>
                </div>
                <CardTitle className="text-lg">{request.property.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="text-sm">
                    <p className="font-medium">{request.tenant.name}</p>
                    <p className="flex items-center gap-1 text-muted-foreground">
                        <MailIcon className="size-3.5" />
                        {request.tenant.email}
                    </p>
                </div>

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

                {request.status === "PENDING" && (
                    <div className="flex gap-2 pt-2">
                        <Button
                            size="sm"
                            className="flex-1"
                            disabled={isPending}
                            onClick={() => handleStatusChange("APPROVED")}
                        >
                            <CheckIcon data-icon="inline-start" />
                            Accept
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                            disabled={isPending}
                            onClick={() => handleStatusChange("REJECTED")}
                        >
                            <XIcon data-icon="inline-start" />
                            Reject
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}