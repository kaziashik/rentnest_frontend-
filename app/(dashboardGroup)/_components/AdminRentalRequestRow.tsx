import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getStatusBadgeClass } from "@/lib/statusBadge";
import { IRentalRequest } from "@/lib/types";
import { CalendarIcon, MailIcon } from "lucide-react";

type AdminRentalRequestRowProps = {
    request: IRentalRequest;
}

export function AdminRentalRequestRow({ request }: AdminRentalRequestRowProps) {
    const statusVariant =
        request.status === "COMPLETED" || request.status === "APPROVED" || request.status === "ACTIVE"
            ? "default"
            : request.status === "REJECTED"
                ? "destructive"
                : "outline";

    return (
        <Card>
            <CardContent className="space-y-2 py-4">
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getStatusBadgeClass(request.status)}>
                        {request.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString("en-US")}
                    </span>
                </div>

                <p className="font-medium">{request.property.title}</p>
                <p className="text-sm text-muted-foreground">RM{request.property.rentPrice}/mo</p>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MailIcon className="size-3.5" />
                    {request.tenant.name} · {request.tenant.email}
                </div>

                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarIcon className="size-3" />
                    Move-in: {new Date(request.moveInDate).toLocaleDateString("en-US")}
                </p>

                <p className="line-clamp-2 text-sm text-muted-foreground">{request.message}</p>
            </CardContent>
        </Card>
    )
}