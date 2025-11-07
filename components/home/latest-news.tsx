// src/components/home/latest-news.tsx
"use client";

import { useMemo } from "react";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Newspaper, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { NewsArticle } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Adjust for timezone offset to display the correct date as entered
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    
    return adjustedDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function LatestNews() {
    // Simplified query to avoid composite index errors. We'll filter client-side.
    const newsQuery = useMemo(() => {
        const newsRef = collection(db, 'news');
        return query(newsRef, orderBy("publishedDate", "desc"), limit(10)); // Fetch more to filter from
    }, []);
    const [snapshot, loading] = useCollection(newsQuery);

    const newsArticles = useMemo(() => {
        if (!snapshot) return [];
        return snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as NewsArticle))
            .filter(article => article.isActive) // Filter for active articles on the client
            .slice(0, 3); // Take the first 3 active articles
    }, [snapshot]);

    const NewsCardSkeleton = () => (
        <Card className="flex flex-col">
            <Skeleton className="h-48 w-full" />
            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
            <CardContent><Skeleton className="h-12 w-full" /></CardContent>
            <CardFooter><Skeleton className="h-4 w-1/3" /></CardFooter>
        </Card>
    );

    return (
        <section>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold font-headline flex items-center gap-3">
                    <Newspaper className="h-8 w-8 text-primary" />
                    Últimas Noticias
                </h2>
                <Button variant="link" asChild>
                    <Link href="/news">
                        Ver todas <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading && Array.from({ length: 3 }).map((_, i) => <NewsCardSkeleton key={i}/>)}

                {!loading && newsArticles.length > 0 && newsArticles.map(article => (
                    <Card key={article.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        {article.imageUrl && (
                            <div className="relative w-full h-48 bg-muted">
                                <Image 
                                    src={article.imageUrl} 
                                    alt={`Imagen para ${article.title}`} 
                                    fill
                                    className="object-cover" 
                                />
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="font-headline text-xl leading-tight h-14 overflow-hidden">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-3 h-16 overflow-hidden">{article.summary}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">{formatDate(article.publishedDate)}</p>
                            <Button asChild variant="link" className="p-0">
                                <Link href={`/news/${article.id}`}>
                                    Leer más <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
             {!loading && newsArticles.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                    <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No hay noticias publicadas</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Vuelve más tarde para ver las últimas novedades.
                    </p>
                </div>
            )}
        </section>
    );
}
