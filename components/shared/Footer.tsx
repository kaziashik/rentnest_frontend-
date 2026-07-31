import Link from "next/link";
import { HomeIcon } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border/60 bg-muted/50 mt-auto">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <HomeIcon className="size-3.5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-primary">
                            RentNest
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        &copy; 2026 RentNest. Built by Kazi Ashik.
                    </p>
                </div>
            </div>
        </footer>
    );
}