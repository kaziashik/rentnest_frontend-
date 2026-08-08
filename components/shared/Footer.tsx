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
      <div className="container-page section-pad !py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HomeIcon className="size-4" />
              </div>
              <span className="font-display text-xl font-semibold text-primary">
                RentNest
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A trusted rental marketplace connecting tenants and landlords across
              Malaysia — browse, request, approve, and pay in one place.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MailIcon className="size-4 text-primary" />
                support@rentnest.com
              </p>
              <p className="flex items-center gap-2">
                <PhoneIcon className="size-4 text-primary" />
                +60 16-836 4407
              </p>
              <p className="flex items-center gap-2">
                <MapPinIcon className="size-4 text-primary" />
                Penang, Malaysia
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">Explore</h3>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">Follow</h3>
            <ul className="space-y-2.5">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-2">
              <Link href="/register">
                <span className="inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                  Get started
                </span>
              </Link>
              <Link href="/login">
                <span className="inline-flex rounded-full border px-4 py-2 text-xs font-semibold">
                  Login
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} RentNest. Built by Kazi Ashik.</p>
          <p>Secure payments powered by Stripe</p>
        </div>
      </div>
    </footer>
  );
}
