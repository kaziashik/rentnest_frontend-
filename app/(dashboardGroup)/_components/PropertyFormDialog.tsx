/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICategory, IProperty } from "@/lib/types";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createProperty } from "../_actions/propertyActions";
import { updateProperty } from "../_actions/propertyUpdate";

type PropertyFormDialogProps = {
    mode: "create" | "edit";
    property?: IProperty;
    categories: ICategory[];
}

export function PropertyFormDialog({ mode, property, categories }: PropertyFormDialogProps) {
    const [open, setOpen] = useState(false);

    const action = mode === "edit" && property
        ? updateProperty.bind(null, property.id)
        : createProperty;

    const [state, formAction, pending] = useActionState(action, null) as any;

    useEffect(() => {
        if (!state) return;

        if (state.success) {
            toast.success(state.message || (mode === "edit" ? "Successfully updated the property details" : "Property created successfully"));
            setOpen(false);
        } else {
            toast.error(state.message || "Something went wrong");
        }
    }, [state, mode]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {
                    mode === "edit" ? (
                        <Button variant="outline" size="sm">
                            <PencilIcon data-icon="inline-start" />
                            Update
                        </Button>
                    ) : (
                        <Button>
                            <PlusIcon data-icon="inline-start" />
                            Add Property
                        </Button>
                    )
                }
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "edit" ? "Update Property" : "Add Property"}
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
                        <Label htmlFor="property_image">Image URLs (comma separated)</Label>
                        <Input id="property_image" name="property_image" defaultValue={property?.property_image?.join(", ")} placeholder="https://..., https://..." required />
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
                        <Button type="submit" disabled={pending}>
                            {pending ? "Saving..." : mode === "edit" ? "Update Property" : "Create Property"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}