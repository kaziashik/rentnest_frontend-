"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { IProfile } from "@/lib/types";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfile } from "../_actions/updateProfile";

type ProfileFormProps = {
    profile: IProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const router = useRouter();
    const [photoUrl, setPhotoUrl] = useState(profile.photo ?? "");
    const [uploading, setUploading] = useState(false);

    const action = updateProfile.bind(null, profile.role);
    const [state, formAction, pending] = useActionState(action, null);

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            toast.success(state.message || "Profile updated successfully");
            router.refresh();
        } else {
            toast.error(state.message || "Something went wrong");
        }
    }, [state, router]);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append("image", file);

            const res = await fetch("/api/upload-image", {
                method: "POST",
                body: uploadFormData,
            });

            const result = await res.json();

            if (result.success) {
                setPhotoUrl(result.url);
                toast.success("Photo uploaded");
            } else {
                toast.error(result.message || "Photo upload failed");
            }
        } catch {
            toast.error("Photo upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <form action={formAction} className="max-w-md space-y-4">
            <div className="space-y-2">
                <Label>Profile photo</Label>
                <div className="flex items-center gap-4">
                    {photoUrl ? (
                        <img
                            src={photoUrl}
                            alt={profile.name}
                            className="size-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                            No photo
                        </div>
                    )}
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        disabled={uploading}
                        className="max-w-xs"
                    />
                </div>
                {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
                <input type="hidden" name="photo" value={photoUrl} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={profile.name} required />
            </div>
            <div className="space-y-2">
                <Label>Email</Label>
                <Input value={profile.email} disabled />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} required />
            </div>
            <div className="space-y-2">
                <Label>Role</Label>
                <div>
                    <Badge variant="outline">{profile.role}</Badge>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Account Status</Label>
                <div>
                    <Badge variant={profile.activeStatus === "ACTIVE" ? "default" : "destructive"}>
                        {profile.activeStatus}
                    </Badge>
                </div>
            </div>
            <Button type="submit" className="rounded-full" disabled={pending || uploading}>
                {pending ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    )
}