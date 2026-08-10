import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardActionItem = {
  title: string;
  description: string;
  href: string;
  count?: number;
  tone?: "default" | "warning" | "success";
};

type DashboardActionQueueProps = {
  title?: string;
  items: DashboardActionItem[];
};

export function DashboardActionQueue({
  title = "Needs attention",
  items,
}: DashboardActionQueueProps) {
  if (!items.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href + item.title}
            href={item.href}
            className={cn(
              "group rounded-xl border bg-card p-4 transition hover:bg-muted/40",
              item.tone === "warning" && "border-amber-200/80",
              item.tone === "success" && "border-emerald-200/80",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {typeof item.count === "number" ? (
                  <span className="rounded-full border bg-muted/50 px-2.5 py-0.5 text-sm font-semibold tabular-nums">
                    {item.count}
                  </span>
                ) : null}
                <ArrowRightIcon className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
