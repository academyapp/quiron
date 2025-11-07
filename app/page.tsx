// app/page.tsx
"use client";

import { BannersDisplay } from "@/components/banners/banners-display";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LatestNews } from "@/components/home/latest-news";
import { RecentMatches } from "@/components/home/recent-matches";
import { FeaturedAcademies } from "@/components/home/featured-academies";

function HeroSection() {
  const heroImageUrl = "/hero.png";
  const heroImageDescription = "Un estadio de fútbol iluminado por la noche, visto desde las gradas.";
  
  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
      <Image
        src={heroImageUrl}
        alt={heroImageDescription}
        fill
        className="object-cover object-center"
        priority
        data-ai-hint="stadium night"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 px-4">
        <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">
          Bienvenido a Quirón
        </h1>
        <p className="text-md md:text-lg max-w-2xl mx-auto mt-4 text-white/80">
          La plataforma todo-en-uno para la gestión de tu academia de fútbol.
        </p>
        <Button size="lg" className="mt-8" asChild>
            <Link href="/academies">
                Explorar Academias <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
        </Button>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
        <div className="container mx-auto py-16 space-y-16">
            <RecentMatches />
            <LatestNews />
            <FeaturedAcademies />
            <BannersDisplay location="home" />
        </div>
      </main>
    </div>
  );
}
