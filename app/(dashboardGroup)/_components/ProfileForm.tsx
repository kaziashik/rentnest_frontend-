"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { IProfile } from "@/lib/types";
import { CameraIcon, Trash2Icon, UserIcon } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfile } from "../_actions/updateProfile";

type ProfileFormProps = {
  profile: IProfile;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatJoined(date: string) {
  try {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function roleBadgeClass(role: IProfile["role"]) {
  if (role === "ADMIN") return "border-violet-200 bg-violet-50 text-violet-700";
  if (role === "LANDLORD") return "border-sky-200 bg-sky-50 text-sky-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState(profile.photo ?? "");
  const [uploading, setUploading] = useState(false);

  const [state, formAction, pending] = useActionState(updateProfile, null);

  useEffect(() => {
    setPhotoUrl(profile.photo ?? "");
  }, [profile.photo]);

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

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5MB");
      return;
    }

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
        toast.success("Photo ready — click Save Changes to keep it");
      } else {
        toast.error(result.message || "Photo upload failed");
      }
    } catch {
      toast.error("Photo upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <form
      action={formAction}
      className="overflow-hidden rounded-xl border bg-card"
    >
      <div className="border-b bg-muted/30 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={profile.name}
                className="size-20 rounded-full object-cover ring-2 ring-background"
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground ring-2 ring-background">
                {initials(profile.name) || <UserIcon className="size-7" />}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <p className="truncate text-lg font-semibold tracking-tight">
                {profile.name}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {profile.email}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={roleBadgeClass(profile.role)}>
                {profile.role}
              </Badge>
              <Badge
                variant="outline"
                className={
                  profile.activeStatus === "ACTIVE"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }
              >
                {profile.activeStatus}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Joined {formatJoined(profile.createdAt)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
                disabled={uploading}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <CameraIcon data-icon="inline-start" />
                {uploading ? "Uploading..." : photoUrl ? "Change photo" : "Upload photo"}
              </Button>
              {photoUrl && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={uploading}
                  onClick={() => setPhotoUrl("")}
                >
                  <Trash2Icon data-icon="inline-start" />
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              JPG or PNG, max 5MB. Upload first, then save.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 py-5 sm:px-6">
        <input type="hidden" name="photo" value={photoUrl} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={profile.name}
              required
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile.email}
              disabled
              className="rounded-lg bg-muted/40"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here.
            </p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={profile.phone ?? ""}
              required
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="rounded-full px-6"
            disabled={pending || uploading}
          >
            {pending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
