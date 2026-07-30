"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICategory } from "@/lib/types";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProperty } from "../_actions/propertyActions";


type CreatePropertyFormProps = {
    categories: ICategory[];
}

export function CreatePropertyForm({ categories }: CreatePropertyFormProps) {
    const router = useRouter();

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
                <Label htmlFor="property_image">Image URLs (comma separated)</Label>
                <Input id="property_image" name="property_image" placeholder="https://..., https://..." required />
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

            <Button type="submit" disabled={pending}>
                {pending ? "Creating..." : "Create Property"}
            </Button>
        </form>
    )
}