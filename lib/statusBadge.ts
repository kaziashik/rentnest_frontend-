import { IRentalStatus } from "@/lib/types";

export function getStatusBadgeClass(status: IRentalStatus): string {
    switch (status) {
        case "PENDING":
            return "border-yellow-500 bg-yellow-50 text-yellow-700 hover:bg-yellow-50";
        case "APPROVED":
            return "border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-50";
        case "REJECTED":
            return "border-red-500 bg-red-50 text-red-700 hover:bg-red-50";
        case "ACTIVE":
            return "border-green-500 bg-green-50 text-green-700 hover:bg-green-50";
        case "COMPLETED":
            return "border-gray-400 bg-gray-100 text-gray-600 hover:bg-gray-100";
        default:
            return "";
    }
}