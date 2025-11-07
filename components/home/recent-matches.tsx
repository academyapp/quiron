// src/components/home/recent-matches.tsx
"use client";

import { useMemo } from "react";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Trophy, ArrowRight } from "lucide-react";
import type { Match } from "@/lib/types";
import { MatchCard } from "@/components/matches/match-card";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import Link from "next/link";

export function RecentMatches() {
    const matchesQuery = useMemo(() => {
        const matchesRef = collection(db, 'matches');
        return query(matchesRef, orderBy("date", "desc"), limit(3));
    }, []);
    const [snapshot, loading] = useCollection(matchesQuery);

    const matches = useMemo(() => {
        if (!snapshot) return [];
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
    }, [snapshot]);

    const MatchCardSkeleton = () => (
         <Skeleton className="h-40 w-full" />
    );

    return (
        <section>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold font-headline flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-primary" />
                    Resultados Recientes
                </h2>
                <Button variant="link" asChild>
                    <Link href="/matches">
                        Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && Array.from({ length: 3 }).map((_, i) => <MatchCardSkeleton key={i} />)}
                {!loading && matches.length > 0 && matches.map(match => (
                    <MatchCard key={match.id} match={match} />
                ))}
                 {!loading && matches.length === 0 && (
                     <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                        <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No hay partidos registrados</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Los resultados de los últimos partidos aparecerán aquí.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
