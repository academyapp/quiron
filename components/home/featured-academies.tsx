// src/components/home/featured-academies.tsx
"use client";

import { useMemo } from "react";
import { collection, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Loader2, Shield, ArrowRight } from "lucide-react";
import type { Academy } from "@/lib/types";
import { AcademyCard } from "@/components/academies/academy-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "../ui/button";
import Link from "next/link";


export function FeaturedAcademies() {
    const academiesQuery = useMemo(() => {
        const academiesRef = collection(db, 'academies');
        return query(academiesRef, where("isActive", "==", true), limit(9));
    }, []);
    const [snapshot, loading] = useCollection(academiesQuery);

    const academies = useMemo(() => {
        if (!snapshot) return [];
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Academy));
    }, [snapshot]);


    if (loading) {
        return (
             <div className="text-center">
                 <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                 <p className="text-muted-foreground mt-2">Cargando academias...</p>
             </div>
        )
    }
    
    if (!academies || academies.length === 0) {
        return null;
    }

    return (
        <section>
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold font-headline flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    Academias Destacadas
                </h2>
                <Button variant="link" asChild>
                    <Link href="/academies">
                        Ver todas <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </div>
             <Carousel
                opts={{
                    align: "start",
                    loop: academies.length > 3,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {academies.map((academy) => (
                        <CarouselItem key={academy.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                           <AcademyCard academy={academy} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </section>
    );
}
