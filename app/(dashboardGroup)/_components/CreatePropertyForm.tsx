"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICategory } from "@/lib/types";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { XIcon } from "lucide-react";
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
                    <div className="grid grid-cols-3 gap-2 pt-2 sm:grid-cols-4">
                        {imageUrls.map((url, index) => (
                            <div key={url} className="relative">
                                <img
                                    src={url}
                                    alt={`Property image ${index + 1}`}
                                    className="h-20 w-full rounded-md object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-white"
                                >
                                    <XIcon className="size-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {imageUrls.map((url) => (
                    <input key={url} type="hidden" name="property_image" value={url} />
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