"use client";

import { ISidebarItem, NavbarProps } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarMenuItems } from "../_config/sidebarMenuItems";
import { cn } from "@/lib/utils";

export default function DashboardSidebar({ user }: NavbarProps) {
  const pathname = usePathname();

  let navItems: ISidebarItem[] = [];

  if (user.data.role === "TENANT") {
    navItems = sidebarMenuItems.TENANT;
  } else if (user.data.role === "LANDLORD") {
    navItems = sidebarMenuItems.LANDLORD;
  } else if (user.data.role === "ADMIN") {
    navItems = sidebarMenuItems.ADMIN;
  }

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border/70 bg-muted/30 md:block lg:w-60">
      <nav className="sticky top-20 flex flex-col gap-1 p-3">
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
    </aside>
  );
}
