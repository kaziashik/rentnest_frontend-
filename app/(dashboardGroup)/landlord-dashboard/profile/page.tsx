import { Suspense } from "react";
import { IProfile } from "@/lib/types";
import { getMyProfile } from "../../_actions/getMyProfile";
import { ProfileForm } from "../../_components/ProfileForm";

async function ProfileContent() {
    const result = await getMyProfile();

    if (!result.success || !result.data) {
        return (
            <p className="py-12 text-center text-muted-foreground">
                Unable to load profile.
            </p>
        );
    }

    const profile: IProfile = result.data;

    return <ProfileForm profile={profile} />;
}

function ProfileSkeleton() {
    return <div className="h-96 max-w-md animate-pulse rounded-2xl bg-muted" />;
}

export default function LandlordProfilePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileContent />
            </Suspense>
        </div>
    );
}