import Link from "next/link";
import { HomeIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X / Twitter", href: "https://x.com" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/80">
      <div className="container-page px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
          <div className="col-span-2 space-y-2.5 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <HomeIcon className="size-3.5" />
              </div>
              <span className="font-display text-lg font-semibold text-primary">
                RentNest
              </span>
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              A trusted rental marketplace connecting tenants and landlords across
              Malaysia — browse, request, approve, and pay in one place.
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <MailIcon className="size-3.5 shrink-0 text-primary" />
                support@rentnest.com
              </p>
              <p className="flex items-center gap-1.5">
                <PhoneIcon className="size-3.5 shrink-0 text-primary" />
                +60 16-836 4407
              </p>
              <p className="flex items-center gap-1.5">
                <MapPinIcon className="size-3.5 shrink-0 text-primary" />
                Penang, Malaysia
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold tracking-wide uppercase">Explore</h3>
            <ul className="space-y-1.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold tracking-wide uppercase">Company</h3>
            <ul className="space-y-1.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold tracking-wide uppercase">Follow</h3>
            <ul className="space-y-1.5">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Link href="/register">
                <span className="inline-flex rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                  Get started
                </span>
              </Link>
              <Link href="/login">
                <span className="inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold">
                  Login
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-1.5 border-t pt-3 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 RentNest. Built by Kazi Ashik.</p>
          <p>Secure payments powered by Stripe</p>
        </div>
      </div>
    </footer>
  );
}
