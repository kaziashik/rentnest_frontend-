"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICategory } from "@/lib/types";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageIcon, XIcon } from "lucide-react";
import { createProperty } from "../_actions/propertyActions";

type CreatePropertyFormProps = {
    categories: ICategory[];
}

export function CreatePropertyForm({ categories }: CreatePropertyFormProps) {
    const router = useRouter();
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const [state, formAction, pending] = useActionState(createProperty, null);

    useEffect(() => {
        if (!state) return;

        if (state.success) {
            toast.success(state.message || "Property created successfully");
            router.push("/landlord-dashboard/properties");
        } else {
            toast.error(state.message || "Something went wrong");
        }
    }, [state, router]);

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

    /** Card thumbnail = first image in the list */
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
        <form action={formAction} className="max-w-2xl space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="Ipoh, MY" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <select
                    id="categoryId"
                    name="categoryId"
                    required
                    defaultValue=""
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
                    <Input id="rentPrice" name="rentPrice" type="number" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bedRooms">Bedrooms</Label>
                    <Input id="bedRooms" name="bedRooms" type="number" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bathRooms">Bathrooms</Label>
                    <Input id="bathRooms" name="bathRooms" type="number" required />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="fetures">Features (comma separated)</Label>
                <Input id="fetures" name="fetures" placeholder="wifi, fan, shared-kitchen" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="images">Property images</Label>
                <p className="text-xs text-muted-foreground">
                    Upload multiple photos, then click <span className="font-medium">Set as thumbnail</span> on the one you want for the property card.
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
                    <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
                        {imageUrls.map((url, index) => (
                            <div
                                key={`${url}-${index}`}
                                className={`relative overflow-hidden rounded-xl border-2 ${
                                    index === 0 ? "border-primary" : "border-transparent"
                                }`}
                            >
                                <img
                                    src={url}
                                    alt={`Property image ${index + 1}`}
                                    className="h-28 w-full object-cover"
                                />
                                {index === 0 ? (
                                    <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                                        Card thumbnail
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setAsThumbnail(index)}
                                        className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-background/95 px-2 py-1 text-[10px] font-medium shadow-sm hover:bg-background"
                                    >
                                        <ImageIcon className="size-3" />
                                        Set as thumbnail
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-red-500 text-white"
                                    aria-label="Remove image"
                                >
                                    <XIcon className="size-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {imageUrls.map((url, index) => (
                    <input key={`${url}-hidden-${index}`} type="hidden" name="property_image" value={url} />
                ))}
            </div>

            <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <select
                    id="availability"
                    name="availability"
                    defaultValue="AVAILABLE"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                >
                    <option value="AVAILABLE">Available</option>
                    <option value="UNAVAILABLE">Unavailable</option>
                </select>
            </div>

            <Button
                type="submit"
                className="rounded-full"
                disabled={pending || uploading || imageUrls.length === 0}
            >
                {pending ? "Creating..." : uploading ? "Uploading images..." : "Create Property"}
            </Button>
        </form>
    )
}
