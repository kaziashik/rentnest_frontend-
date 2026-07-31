"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { registerAction } from "../_actions/authAction"

const RegisterForm = () => {
  const [state, action, pending] = useActionState(registerAction, false)
  const [photoUrl, setPhotoUrl] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!state) return;
    if (!state.success) {
      toast.error(state.message || "Registration failed");
    }
  }, [state]);

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
    <form action={action} className="space-y-4">
      <Card className="p-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" placeholder="Your full name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="At least 6 characters" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="0168364407" required />
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
          <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} disabled={uploading} />
          {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
          {photoUrl && !uploading && (
            <img src={photoUrl} alt="Preview" className="mt-2 size-16 rounded-full object-cover" />
          )}
          <input type="hidden" name="photo" value={photoUrl} />
        </div>

        <Button type="submit" className="w-full" disabled={uploading}>
          {pending ? "Creating account..." : "Register"}
        </Button>
      </Card>
    </form>
  )
}

export default RegisterForm