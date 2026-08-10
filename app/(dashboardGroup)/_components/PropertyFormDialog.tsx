/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICategory, IProperty } from "@/lib/types";
import { ImageIcon, PencilIcon, PlusIcon, XIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createProperty } from "../_actions/propertyActions";
import { updateProperty } from "../_actions/propertyUpdate";
import { cn } from "@/lib/utils";

type PropertyFormDialogProps = {
    mode: "create" | "edit";
    property?: IProperty;
    categories: ICategory[];
    compact?: boolean;
    triggerLabel?: string;
    triggerClassName?: string;
}

export function PropertyFormDialog({
    mode,
    property,
    categories,
    compact = false,
    triggerLabel,
    triggerClassName,
}: PropertyFormDialogProps) {
    const [open, setOpen] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>(property?.property_image ?? []);
    const [uploading, setUploading] = useState(false);

    const action = mode === "edit" && property
        ? updateProperty.bind(null, property.id)
        : createProperty;

    const [state, formAction, pending] = useActionState(action, null) as any;

    useEffect(() => {
        if (open) {
            setImageUrls(property?.property_image ?? []);
        }
    }, [open, property?.property_image]);

    useEffect(() => {
        if (!state) return;

        if (state.success) {
            toast.success(state.message || (mode === "edit" ? "Successfully updated the property details" : "Property created successfully"));
            setOpen(false);
        } else {
            toast.error(state.message || "Something went wrong");
        }
    }, [state, mode]);

    const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const uploadFormData = new FormData();
                uploadFormData.append("image", file);
                const res = await fetch("/api/upload-image", {
                    method: "POST",
                    body: uploadFormData,
                });
                const result = await res.json();
                return result.success ? result.url : null;
            });

            const urls = await Promise.all(uploadPromises);
            const successfulUrls = urls.filter((url): url is string => !!url);
            setImageUrls((prev) => [...prev, ...successfulUrls]);

            if (successfulUrls.length < files.length) {
                toast.error("Some images failed to upload");
            } else {
                toast.success(`${successfulUrls.length} image(s) uploaded`);
            }
        } catch {
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        setImageUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const setAsThumbnail = (index: number) => {
        if (index === 0) return;
        setImageUrls((prev) => {
            const next = [...prev];
            const [selected] = next.splice(index, 1);
            next.unshift(selected);
            return next;
        });
        toast.success("Thumbnail updated — this photo will show on property cards");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {mode === "edit" ? (
                    <Button
                        variant={compact ? "secondary" : "default"}
                        size={compact ? "icon-sm" : "sm"}
                        className={cn(
                            compact &&
                                "size-8 rounded-full border-0 bg-background/95 shadow-sm hover:bg-background",
                            triggerClassName,
                        )}
                        aria-label="Edit property"
                    >
                        <PencilIcon className={compact ? "size-3.5" : undefined} />
                        {!compact && (triggerLabel || "Edit")}
                    </Button>
                ) : (
                    <Button className={triggerClassName}>
                        <PlusIcon data-icon="inline-start" />
                        {triggerLabel || "Add Property"}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "edit" ? "Edit property" : "Add Property"}
                    </DialogTitle>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" defaultValue={property?.title} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" defaultValue={property?.location} placeholder="Ipoh, MY" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Category</Label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            required
                            defaultValue={property?.categoryId ?? ""}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="rentPrice">Rent Price</Label>
                            <Input id="rentPrice" name="rentPrice" type="number" defaultValue={property?.rentPrice} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bedRooms">Bedrooms</Label>
                            <Input id="bedRooms" name="bedRooms" type="number" defaultValue={property?.bedRooms} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bathRooms">Bathrooms</Label>
                            <Input id="bathRooms" name="bathRooms" type="number" defaultValue={property?.bathRooms} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fetures">Features (comma separated)</Label>
                        <Input id="fetures" name="fetures" defaultValue={property?.fetures?.join(", ")} placeholder="wifi, fan, shared-kitchen" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="images">Property images</Label>
                        <p className="text-xs text-muted-foreground">
                            First image is the card thumbnail. Click <span className="font-medium">Set as thumbnail</span> to change it.
                        </p>
                        <Input
                            id="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                            disabled={uploading}
                        />
                        {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}

                        {imageUrls.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 pt-2">
                                {imageUrls.map((url, index) => (
                                    <div
                                        key={`${url}-${index}`}
                                        className={`relative overflow-hidden rounded-xl border-2 ${
                                            index === 0 ? "border-primary" : "border-border"
                                        }`}
                                    >
                                        <img
                                            src={url}
                                            alt={`Property image ${index + 1}`}
                                            className="h-24 w-full object-cover"
                                        />
                                        {index === 0 ? (
                                            <span className="absolute top-1.5 left-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                                                Card thumbnail
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setAsThumbnail(index)}
                                                className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-background/95 px-2 py-1 text-[10px] font-medium shadow-sm"
                                            >
                                                <ImageIcon className="size-3" />
                                                Set as thumbnail
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-white"
                                            aria-label="Remove image"
                                        >
                                            <XIcon className="size-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {imageUrls.map((url, index) => (
                            <input
                                key={`${url}-hidden-${index}`}
                                type="hidden"
                                name="property_image"
                                value={url}
                            />
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="availability">Availability</Label>
                        <select
                            id="availability"
                            name="availability"
                            defaultValue={property?.availability ?? "AVAILABLE"}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="UNAVAILABLE">Unavailable</option>
                        </select>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={pending || uploading || imageUrls.length === 0}>
                            {pending ? "Saving..." : mode === "edit" ? "Update Property" : "Create Property"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
