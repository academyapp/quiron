// src/components/layout/footer.tsx
"use client";

import { Logo } from "@/components/logo";
import { Button } from "../ui/button";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/quiron.app" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/quiron_app" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/quiron.app" },
    { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/@quiron_app" },
];

const footerLinks = [
    { title: "Academias", href: "/academies" },
    { title: "Partidos", href: "/matches" },
    { title: "Noticias", href: "/news" },
    { title: "Ranking", href: "/ranking" },
    { title: "Nosotros", href: "/nosotros" },
];

export function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto px-6 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <Logo />
                        <p className="text-muted-foreground mt-4 text-sm max-w-xs">
                            La plataforma líder para la gestión y seguimiento del talento en el fútbol formativo.
                        </p>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-semibold text-foreground">Navegación</h3>
                            <ul className="mt-4 space-y-2">
                                {footerLinks.map((link) => (
                                    <li key={link.title}>
                                        <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-foreground">Social</h3>
                            <div className="flex mt-4 space-x-2">
                                {socialLinks.map((social) => (
                                    <Button key={social.name} variant="ghost" size="icon" asChild>
                                        <a href={social.href} aria-label={social.name} target="_blank" rel="noopener noreferrer">
                                            <social.icon className="h-5 w-5 text-muted-foreground" />
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Quiron.co. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
