import { Suspense } from "react";
import { IProfile } from "@/lib/types";
import { getMyProfile } from "../../_actions/getMyProfile";
import { ProfileForm } from "../../_components/ProfileForm";

async function ProfileContent() {
  const result = await getMyProfile();

  if (!result.success || !result.data) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {result.message || "Unable to load profile."}
      </p>
    );
  }

  const profile: IProfile = result.data;
  return <ProfileForm profile={profile} />;
}

function ProfileSkeleton() {
  return <div className="h-80 max-w-2xl animate-pulse rounded-xl bg-muted" />;
}

export default function AdminProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
        Profile
      </h1>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}
