// src/components/banners/banners-display.tsx
"use client";

import { useMemo } from "react";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import type { Banner, BannerLocation } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

interface BannersDisplayProps {
    location: BannerLocation;
}

export function BannersDisplay({ location }: BannersDisplayProps) {
    const bannersQuery = useMemo(() => {
        const bannersRef = collection(db, 'banners');
        return query(
            bannersRef, 
            where("isActive", "==", true),
            where("locations", "array-contains", location)
        );
    }, [location]);

    const [snapshot, loading] = useCollection(bannersQuery);

    const banners = useMemo(() => {
        if (!snapshot) return [];
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
    }, [snapshot]);

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-2 text-muted-foreground my-8">
                <Loader2 className="h-4 w-4 animate-spin" />
            </div>
        )
    }

    if (!banners || banners.length === 0) {
        return null; // No renderizar nada si no hay banners para esta ubicación
    }

    const renderBannerContent = (banner: Banner) => (
         <Card className="flex items-center justify-center h-48 hover:shadow-md transition-shadow overflow-hidden bg-muted/30">
            <CardContent className="p-0">
                <div className="relative w-[800px] h-48 block">
                    <Image
                        src={banner.imageUrl}
                        alt={`Banner de ${banner.companyName}`}
                        fill
                        className="object-contain"
                    />
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="w-full my-12">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                      delay: 5000,
                    }),
                ]}
                className="w-full max-w-5xl mx-auto"
            >
                <CarouselContent>
                    {banners.map((banner) => (
                        <CarouselItem key={banner.id}>
                            <div className="p-1">
                               {banner.linkUrl ? (
                                    <Link href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
                                       {renderBannerContent(banner)}
                                    </Link>
                                ) : (
                                    renderBannerContent(banner)
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {banners.length > 1 && (
                    <>
                        <CarouselPrevious />
                        <CarouselNext />
                    </>
                )}
            </Carousel>
        </div>
    );
}
