"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type SocialAuthButtonsProps = {
  mode?: "login" | "register";
};

export function SocialAuthButtons({ mode = "login" }: SocialAuthButtonsProps) {
  const handleSocial = (provider: "Google" | "Facebook") => {
    toast.message(`${provider} sign-${mode === "login" ? "in" : "up"} unavailable`, {
      description:
        mode === "login"
          ? "Social login is not working yet for a technical reason. Please sign in with email and password, or use Quick demo access on this page."
          : "Social sign-up is not working yet for a technical reason. Please create an account with email and password, or try the demo site via Login → Quick demo access.",
      duration: 6000,
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={() => handleSocial("Google")}
        >
          <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#EA4335"
              d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.8 3.8 14.6 3 12 3 6.9 3 2.8 7.1 2.8 12.2S6.9 21.4 12 21.4c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1-.2-1.5H12z"
            />
          </svg>
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={() => handleSocial("Facebook")}
        >
          <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#1877F2"
              d="M14 8.5h2.5V5.6c-.4-.1-1.5-.2-2.8-.2-2.8 0-4.7 1.7-4.7 4.8v2.7H6.5V16h2.5v7h3.3v-7h2.7l.5-3.1h-3.2V10c0-.9.2-1.5 1.7-1.5z"
            />
          </svg>
          Facebook
        </Button>
      </div>
    </div>
  );
}
