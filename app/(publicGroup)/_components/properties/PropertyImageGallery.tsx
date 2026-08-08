"use client"

import Image from "next/image";
import { useState } from "react";

function isValidImageUrl(url?: string): url is string {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

type PropertyImageGalleryProps = {
    images: string[];
    title: string;
}

export function PropertyImageGallery({ images, title }: PropertyImageGalleryProps) {
    const validImages = images.filter(isValidImageUrl);
    const [activeIndex, setActiveIndex] = useState(0);

    if (validImages.length === 0) {
        return (
            <div className="flex h-96 w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
                No image
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="relative h-96 w-full overflow-hidden rounded-xl">
                <Image
                    src={validImages[activeIndex]}
                    alt={`${title} - image ${activeIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {validImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {validImages.map((url, index) => (
                        <button
                            key={url}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`relative h-20 overflow-hidden rounded-lg border-2 transition ${
                                index === activeIndex ? "border-primary" : "border-transparent"
                            }`}
                        >
                            <Image
                                src={url}
                                alt={`${title} - thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}