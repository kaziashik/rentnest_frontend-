import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPayment } from "@/lib/types";

type PaymentHistoryTableProps = {
    payments: IPayment[];
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
    if (!payments.length) {
        return (
            <p className="py-8 text-center text-sm text-muted-foreground">
                No payments yet.
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {payments.map((payment) => (
                <Card key={payment.id}>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                                {payment.rentalRequest.property.title}
                            </CardTitle>
                            <Badge variant={payment.paymentStatus === "PAID" ? "default" : "outline"}>
                                {payment.paymentStatus}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                            <span>Amount</span>
                            <span className="font-semibold text-foreground">
                                RM {Number(payment.amount).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Paid on</span>
                            <span>{new Date(payment.paidAt).toLocaleDateString("en-US")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Transaction ID</span>
                            <span className="font-mono text-xs">{payment.transactionId}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}