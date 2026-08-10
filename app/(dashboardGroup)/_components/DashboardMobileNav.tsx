"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { ISidebarItem, NavbarProps } from "@/lib/types";
import { sidebarMenuItems } from "../_config/sidebarMenuItems";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function DashboardMobileNav({ user }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  let navItems: ISidebarItem[] = [];
  if (user.data.role === "TENANT") navItems = sidebarMenuItems.TENANT;
  else if (user.data.role === "LANDLORD") navItems = sidebarMenuItems.LANDLORD;
  else if (user.data.role === "ADMIN") navItems = sidebarMenuItems.ADMIN;

  return (
    <div className="border-b px-4 py-2 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full">
            <MenuIcon className="size-4" />
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b px-4 py-4 text-left">
            <SheetTitle>Dashboard</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-3">
            {navItems.map((item) => {
              const hrefs = navItems.map((n) => n.href);
              const exact = pathname === item.href;
              const nested =
                pathname.startsWith(`${item.href}/`) &&
                !hrefs.some(
                  (href) =>
                    href !== item.href &&
                    href.startsWith(item.href) &&
                    (pathname === href || pathname.startsWith(`${href}/`)),
                );
              const active = exact || nested;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "inline-flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
