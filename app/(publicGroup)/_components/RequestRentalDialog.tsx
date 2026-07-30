"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createRentalRequest } from "../_actions/rentalActions";


type RequestRentalDialogProps = {
    propertyId: string;
    availability: "AVAILABLE" | "UNAVAILABLE";
}

export function RequestRentalDialog({ propertyId, availability }: RequestRentalDialogProps) {
    const [open, setOpen] = useState(false);

    const action = createRentalRequest.bind(null, propertyId);
    const [state, formAction, pending] = useActionState(action, null);

    useEffect(() => {
        if (!state) return;

        if (state.success) {
            toast.success(state.message || "Rental request submitted successfully");
            setOpen(false);
        } else {
            toast.error(state.message || "Something went wrong");
        }
    }, [state]);

    if (availability !== "AVAILABLE") {
        return (
            <Button disabled className="w-full">
                Unavailable
            </Button>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">
                    <SendIcon data-icon="inline-start" />
                    Request to Rent
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Request to Rent</DialogTitle>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
                        <Input id="moveInDate" name="moveInDate" type="date" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message to Landlord</Label>
                        <Textarea
                            id="message"
                            name="message"
                            required
                            placeholder="I am very interested in this property and would like to move in by the requested date."
                            className="min-h-28"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={pending}>
                            {pending ? "Submitting..." : "Submit Request"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}