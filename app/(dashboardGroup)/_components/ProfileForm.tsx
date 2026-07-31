"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { IProfile } from "@/lib/types";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfile } from "../_actions/updateProfile";

type ProfileFormProps = {
    profile: IProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const router = useRouter();

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

    return (
        <form action={formAction} className="max-w-md space-y-4">
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

            <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    )
}