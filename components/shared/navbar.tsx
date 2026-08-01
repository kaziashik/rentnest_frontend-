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

import { HomeIcon, LayoutDashboard, LogOut, Settings, User, MenuIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { logout } from "@/service/logout";
import { NavbarProps } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";

// Navigation items configuration
const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

// User menu items configuration
const userMenuItems = [
  { label: "Dashboard", icon: LayoutDashboard, action: "dashboard" },
  { label: "Profile", icon: User, action: "profile" },
  { label: "Settings", icon: Settings, action: "settings" },
];


export function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleUserMenuAction = async (action: string) => {

    if (action === "dashboard") {
      if (user.data.role === "TENANT") {
        router.push("/dashboard")
      }
      else if (user.data.role === "LANDLORD") {
        router.push("/landlord-dashboard")
      }
      else if (user.data.role === "ADMIN") {
        router.push("/admin-dashboard")
      }

      return;
    }

    if (action === "logout") {
      await logout();
      toast.success("User Logged Out Successfully!");
      router.push("/login");
    }
  };

  return (
    <nav className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105">
              <HomeIcon className="size-4" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary transition-colors duration-300 group-hover:text-primary/80">
              RentNest
            </span>
          </Link>

          {/* Nav Links — desktop only */}
          <div className="hidden md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:flex md:items-center md:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side: user dropdown / auth buttons — desktop only, + hamburger on mobile */}
          <div className="flex items-center gap-2">

            {/* Desktop-only right side */}
            <div className="hidden md:flex md:items-center md:gap-2">
              {
                user.success ? (
                  <DropdownMenu>
                    <div className="flex items-center gap-2">
                      <DropdownMenuTrigger asChild>
                        <div className="cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </DropdownMenuTrigger>

                      <ThemeToggle />
                    </div>

                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">
                            {user.data?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.data?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <DropdownMenuItem
                            key={item.action}
                            onClick={() => handleUserMenuAction(item.action)}
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            <span>{item.label}</span>
                          </DropdownMenuItem>
                        );
                      })}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={async () => {
                        await handleUserMenuAction("logout");
                      }}>
                        <LogOut className="w-4 h-4 mr-2" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/register">
                      <Button variant="outline" className="cursor-pointer rounded-full px-5">
                        Sign up
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button className="cursor-pointer rounded-full px-5">
                        Login
                      </Button>
                    </Link>
                  </div>
                )
              }
            </div>

            {/* Mobile hamburger trigger */}
            <div className="md:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MenuIcon className="size-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 p-6">
                  <div className="flex flex-col gap-6 pt-8">

                    {/* User info (if logged in) */}
                    {user.success && (
                      <div className="flex items-center gap-3 border-b pb-4">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.data?.name}</p>
                          <p className="text-xs text-muted-foreground">{user.data?.email}</p>
                        </div>
                      </div>
                    )}

                    {/* Nav links */}
                    <div className="flex flex-col gap-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Auth-dependent section */}
                    {user.success ? (
                      <div className="flex flex-col gap-1 border-t pt-4">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.action}
                              onClick={() => {
                                setMobileOpen(false);
                                handleUserMenuAction(item.action);
                              }}
                              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                            >
                              <Icon className="w-4 h-4 mr-2" />
                              {item.label}
                            </button>
                          );
                        })}
                        <button
                          onClick={async () => {
                            setMobileOpen(false);
                            await handleUserMenuAction("logout");
                          }}
                          className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
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
                          <Button className="w-full rounded-full">
                            Login
                          </Button>
                        </Link>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <ThemeToggle />
                    </div>
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