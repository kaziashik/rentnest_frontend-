import { cn } from "@/lib/utils";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Footer } from "@/components/shared/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata = {
  title: {
    default: "RentNest",
    template: "%s | RentNest",
  },
  description:
    "Malaysia's rental marketplace for tenants and landlords. Browse verified listings, request to rent, and pay securely with Stripe.",
  applicationName: "RentNest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", jakarta.variable, fraunces.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-right" richColors />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
