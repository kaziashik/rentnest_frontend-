import { getMyRentalRequests } from "../_actions/getMyRentalRequests";
import { getPaymentHistory } from "../_actions/getPaymentHistory";
import { PayNowButton } from "./PayNowButton";
import { PaymentHistoryTable } from "./PaymentHistoryTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function TenantPaymentsList() {
    const [requestsResult, paymentsResult] = await Promise.all([
        getMyRentalRequests(),
        getPaymentHistory(),
    ]);

    const requests = requestsResult.success ? requestsResult.data : [];
    const payments = paymentsResult.success ? paymentsResult.data : [];

    const paidRequestIds = new Set(payments.map((p: any) => p.requestId));
    const awaitingPayment = requests.filter(
        (r: any) => r.status === "APPROVED" && !paidRequestIds.has(r.id)
    );

    return (
        <div className="space-y-8">
            {awaitingPayment.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold">Awaiting Payment</h2>
                    {awaitingPayment.map((request: any) => (
                        <Card key={request.id}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">
                                    {request.property.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    RM {Number(request.property.rentPrice).toLocaleString()}/mo
                                </span>
                                <PayNowButton requestId={request.id} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="space-y-3">
                <h2 className="text-lg font-semibold">Payment History</h2>
                <PaymentHistoryTable payments={payments} />
            </div>
        </div>
    );
}