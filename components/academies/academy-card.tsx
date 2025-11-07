// src/components/academies/academy-card.tsx
"use client";

import { useMemo } from "react";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, UserCheck } from "lucide-react";
import Image from "next/image";
import type { Academy } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

interface AcademyCardProps {
    academy: Academy;
}

export function AcademyCard({ academy }: AcademyCardProps) {
    const playersQuery = useMemo(() => query(collection(db, "players"), where("academyId", "==", academy.id)), [academy.id]);
    const coachesQuery = useMemo(() => query(collection(db, "coaches"), where("academyId", "==", academy.id)), [academy.id]);

    const [playersSnapshot, playersLoading] = useCollection(playersQuery);
    const [coachesSnapshot, coachesLoading] = useCollection(coachesQuery);

    const playerCount = playersSnapshot?.docs.length || 0;
    const coachCount = coachesSnapshot?.docs.length || 0;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="relative w-full h-48 bg-muted">
                <Image
                    src={academy.coverImageUrl || 'https://picsum.photos/seed/default-cover/600/400'}
                    alt={`Portada de ${academy.name}`}
                    fill
                    className="object-cover"
                />
                <div className="absolute bottom-4 left-4">
                    <div className="relative w-20 h-20">
                        <Image
                            src={academy.logoUrl || 'https://picsum.photos/seed/default-logo/200/200'}
                            alt={`Logo de ${academy.name}`}
                            fill
                            className="rounded-full object-cover border-4 border-background shadow-md"
                        />
                    </div>
                </div>
            </div>
            <CardHeader>
                <CardTitle className="font-headline truncate">{academy.name}</CardTitle>
                <CardDescription>{academy.address}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="flex justify-around items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        {playersLoading ? <Skeleton className="h-4 w-4 rounded-full" /> : <Users className="h-4 w-4" />}
                        {playersLoading ? <Skeleton className="h-4 w-8" /> : <span>{playerCount} Jugadores</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        {coachesLoading ? <Skeleton className="h-4 w-4 rounded-full" /> : <UserCheck className="h-4 w-4" />}
                        {coachesLoading ? <Skeleton className="h-4 w-8" /> : <span>{coachCount} Entrenadores</span>}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Badge variant="secondary">{academy.sport}</Badge>
                    {academy.ageCategory && academy.ageCategory.map(category => (
                        <Badge key={category} variant="outline">{category}</Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant="link" className="p-0">
                    <Link href={`/academies/${academy.id}`}>
                        Ver más detalles <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
