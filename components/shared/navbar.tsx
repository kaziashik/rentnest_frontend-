"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  HomeIcon,
  LayoutDashboard,
  LogOut,
  User,
  MenuIcon,
  ChevronDown,
  Building2,
  BookOpen,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { logout } from "@/service/logout";
import { NavbarProps } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const publicNavItems = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

function dashboardPath(role?: string) {
  if (role === "LANDLORD") return "/landlord-dashboard";
  if (role === "ADMIN") return "/admin-dashboard";
  return "/dashboard";
}

function profilePath(role?: string) {
  if (role === "LANDLORD") return "/landlord-dashboard/profile";
  if (role === "ADMIN") return "/admin-dashboard/profile";
  return "/tenant-dashboard/profile";
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = Boolean(user?.success);

  const loggedInNav = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Dashboard", href: dashboardPath(user?.data?.role) },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const navItems = isLoggedIn ? loggedInNav : publicNavItems.slice(0, 4);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-page px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105">
              <HomeIcon className="size-4" />
            </div>
            <span className="font-display text-2xl font-semibold tracking-tight text-primary">
              RentNest
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}

            {!isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted">
                    More <ChevronDown className="size-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/blog" className="flex items-center gap-2">
                      <BookOpen className="size-4" /> Blog
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/contact" className="flex items-center gap-2">
                      <Phone className="size-4" /> Contact
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/services" className="flex items-center gap-2">
                      <Building2 className="size-4" /> Services
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <ThemeToggle />
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 transition hover:bg-muted">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <User className="size-4" />
                      </div>
                      <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">
                        {user.data?.name}
                      </span>
                      <ChevronDown className="size-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">{user.data?.name}</p>
                        <p className="text-xs text-muted-foreground">{user.data?.email}</p>
                        <p className="text-xs font-medium text-primary">{user.data?.role}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(dashboardPath(user.data?.role))}>
                      <LayoutDashboard className="mr-2 size-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(profilePath(user.data?.role))}>
                      <User className="mr-2 size-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 size-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/register">
                    <Button variant="outline" className="rounded-full px-5">
                      Sign up
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="rounded-full px-5">Login</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MenuIcon className="size-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-6">
                  <div className="flex flex-col gap-6 pt-8">
                    {isLoggedIn && (
                      <div className="flex items-center gap-3 border-b pb-4">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <User className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.data?.name}</p>
                          <p className="text-xs text-muted-foreground">{user.data?.email}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      {(isLoggedIn ? loggedInNav : publicNavItems).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {isLoggedIn ? (
                      <div className="flex flex-col gap-1 border-t pt-4">
                        <button
                          onClick={() => {
                            setMobileOpen(false);
                            router.push(profilePath(user.data?.role));
                          }}
                          className="rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-muted"
                        >
                          Profile
                        </button>
                        <button
                          onClick={async () => {
                            setMobileOpen(false);
                            await handleLogout();
                          }}
                          className="rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
                        >
                          Log out
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 border-t pt-4">
                        <Link href="/register" onClick={() => setMobileOpen(false)}>
                          <Button variant="outline" className="w-full rounded-full">
                            Sign up
                          </Button>
                        </Link>
                        <Link href="/login" onClick={() => setMobileOpen(false)}>
                          <Button className="w-full rounded-full">Login</Button>
                        </Link>
                      </div>
                    )}

                    <ThemeToggle />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
