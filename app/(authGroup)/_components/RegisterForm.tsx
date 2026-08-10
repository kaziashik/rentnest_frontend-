"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { registerAction } from "../_actions/authAction";
import { Loader2 } from "lucide-react";

const RegisterForm = () => {
  const [state, action, pending] = useActionState(registerAction, false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!state) return;
    if (!state.success) {
      toast.error(state.message || "Registration failed");
    }
  }, [state]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
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

  const validate = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const next: Record<string, string> = {};
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const phone = String(data.get("phone") || "").trim();

    if (!name || name.length < 2) next.name = "Name must be at least 2 characters";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (!password || password.length < 6) next.password = "Password must be at least 6 characters";
    if (!phone || phone.length < 8) next.phone = "Enter a valid phone number";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <div className="space-y-5">
      <form
        action={action}
        className="space-y-4"
        onSubmit={(e) => {
          if (!validate(e.currentTarget)) e.preventDefault();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" type="text" placeholder="Your full name" required />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            required
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="0168364407" required />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">I am a</Label>
          <Select name="role" defaultValue="TENANT" required>
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TENANT">Tenant — looking to rent</SelectItem>
              <SelectItem value="LANDLORD">Landlord — listing properties</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo">Profile photo (optional)</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={uploading}
          />
          {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
          {photoUrl && !uploading && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Preview" className="mt-2 size-16 rounded-full object-cover" />
          )}
          <input type="hidden" name="photo" value={photoUrl} />
        </div>

        <Button type="submit" className="w-full rounded-full" disabled={uploading || pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
