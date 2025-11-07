// src/components/matches/match-card.tsx
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Match, Academy } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Trophy as TrophyIcon } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface MatchCardProps {
    match: Match;
}

const formatDate = (isoString: string) => {
    if (!isoString) return 'N/A';
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } catch (e) {
        return 'Fecha inválida';
    }
}

export function MatchCard({ match }: MatchCardProps) {
    const [homeAcademy, setHomeAcademy] = useState<Academy | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAcademy = async () => {
            setLoading(true);
            if (match.academyId) {
                try {
                    const homeRef = doc(db, 'academies', match.academyId);
                    const homeSnap = await getDoc(homeRef);
                    if (homeSnap.exists()) {
                        setHomeAcademy(homeSnap.data() as Academy);
                    }
                } catch (error) {
                    console.error("Error fetching academy details for match card:", error);
                }
            }
            setLoading(false);
        };

        fetchAcademy();
    }, [match.academyId]);

    const handleCardClick = () => {
        router.push(`/matches/${match.id}`);
    };

    const getResultBadge = () => {
        if (match.academyScore > match.opponentScore) {
            return <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">Victoria</Badge>;
        } else if (match.academyScore < match.opponentScore) {
            return <Badge variant="destructive" className="absolute top-2 right-2">Derrota</Badge>;
        } else {
            return <Badge variant="secondary" className="absolute top-2 right-2">Empate</Badge>;
        }
    };

    return (
        <Card onClick={handleCardClick} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full cursor-pointer flex flex-col justify-between">
            <CardContent className="p-4">
                 <div className="flex items-center gap-4">
                    {loading ? (
                        <Skeleton className="w-16 h-16 rounded-full" />
                    ) : (
                        <Image 
                            src={homeAcademy?.logoUrl || 'https://picsum.photos/seed/default-logo/100/100'} 
                            alt={`Logo de ${match.academyName}`}
                            width={64}
                            height={64}
                            className="rounded-full object-cover border"
                        />
                    )}
                    <div className="flex-grow">
                        <p className="font-semibold truncate">{match.academyName}</p>
                        <p className="text-sm text-muted-foreground">vs {match.opponentTeam}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-2xl font-bold font-headline">
                            {match.academyScore} - {match.opponentScore}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(match.date)}</p>
                    </div>
                 </div>
                 {getResultBadge()}
            </CardContent>
            <CardFooter className="bg-muted/50 p-3 text-xs text-muted-foreground border-t flex justify-between">
                <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3"/>
                    <span>{match.location}</span>
                </div>
                 {match.tournament && (
                    <div className="flex items-center gap-1.5">
                        <TrophyIcon className="h-3 w-3"/>
                        <span>{match.tournament}</span>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
