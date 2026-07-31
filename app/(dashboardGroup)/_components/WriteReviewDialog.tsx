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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createReview } from "../_actions/reviewActions";

type WriteReviewDialogProps = {
    propertyId: string;
    requestId: string;
    onReviewed?: () => void;
}

export function WriteReviewDialog({ propertyId, requestId, onReviewed }: WriteReviewDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);

    const action = createReview.bind(null, propertyId, requestId);
    const [state, formAction, pending] = useActionState(action, null);

    useEffect(() => {
        if (!state) return;

        if (state.success) {
            toast.success(state.message || "Review submitted successfully");
            setOpen(false);
            onReviewed?.();
            router.refresh();
        } else {
            toast.error(state.message || "Something went wrong");
        }
    }, [state, router, onReviewed]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">Write a Review</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Rating</Label>
                        <input type="hidden" name="rating" value={rating} />
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setRating(i + 1)}
                                >
                                    <StarIcon
                                        className={`size-6 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Comment</Label>
                        <Textarea
                            id="comment"
                            name="comment"
                            required
                            placeholder="Share your experience with this property..."
                            className="min-h-24"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={pending || rating === 0}>
                            {pending ? "Submitting..." : "Submit Review"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}