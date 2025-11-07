// components/layout/header.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from 'next/navigation'
import { Skeleton } from "../ui/skeleton";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, User, LogOut, ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ROLES } from "@/lib/types";
import { NotificationsBell } from "./notifications-bell";
import { Separator } from "../ui/separator";

const navLinks = [
    { href: "/academies", label: "Academias" },
    { href: "/matches", label: "Partidos" },
    { href: "/news", label: "Noticias" },
    { href: "/ranking", label: "Ranking" },
    { href: "/nosotros", label: "Nosotros" },
];

const UserNav = () => {
    const { profile, logout } = useAuth();

    if (!profile) return null;

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    
    const canAccessAdmin = [
        ROLES.SUPER_ADMIN,
        ROLES.ACADEMY,
        ROLES.COACH,
    ].includes(profile.role);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={profile.photoURL || undefined} alt={profile.displayName || "Usuario"} />
                        <AvatarFallback>{getInitials(profile.displayName || 'U')}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile.displayName}</p>
                        {profile.email && <p className="text-xs leading-none text-muted-foreground">
                            {profile.email}
                        </p>}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {canAccessAdmin && (
                     <DropdownMenuItem asChild>
                        <Link href="/admin">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            <span>Panel de Admin</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                 {(profile.role === ROLES.PARENT_PLAYER && profile.playerId) && (
                    <DropdownMenuItem asChild>
                         <Link href={`/my-dashboard`}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Mi Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                     <LogOut className="mr-2 h-4 w-4" />
                     <span>Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function Header() {
  const { isAuthenticated, loading, profile, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
         <div className="mr-4 flex items-center md:hidden">
             <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Abrir menú de navegación</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col">
                        <SheetHeader>
                            <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
                        </SheetHeader>
                         <nav className="grid gap-6 text-lg font-medium mt-4">
                            <SheetClose asChild>
                                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                                    <Logo />
                                </Link>
                            </SheetClose>
                            <Separator/>
                            {navLinks.map(link => (
                                <SheetClose asChild key={link.href}>
                                    <Link href={link.href} className="hover:text-foreground">
                                        {link.label}
                                    </Link>
                                </SheetClose>
                            ))}
                        </nav>
                        <div className="mt-auto">
                            <Separator className="my-4"/>
                            {loading ? (
                                <Skeleton className="h-10 w-full" />
                            ) : isAuthenticated && profile ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarImage src={profile.photoURL || undefined} />
                                            <AvatarFallback>{profile.displayName?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{profile.displayName}</p>
                                            {profile.email && <p className="text-xs text-muted-foreground">{profile.email}</p>}
                                        </div>
                                    </div>
                                    <SheetClose asChild>
                                        <Button variant="ghost" className="w-full justify-start" asChild>
                                            <Link href={profile.role === ROLES.PARENT_PLAYER ? '/my-dashboard' : '/admin'}>
                                                <ShieldCheck className="mr-2 h-4 w-4" /> Panel
                                            </Link>
                                        </Button>
                                    </SheetClose>
                                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600" onClick={logout}>
                                        <LogOut className="mr-2 h-4 w-4"/> Cerrar Sesión
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <SheetClose asChild>
                                        <Button asChild>
                                        <Link href="/login">Iniciar Sesión</Link>
                                        </Button>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Button variant="outline" asChild>
                                        <Link href="/register">Registrarse</Link>
                                        </Button>
                                    </SheetClose>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
         </div>
        
        <div className="flex flex-1 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
                <Logo />
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">
                        {link.label}
                    </Link>
                ))}
            </nav>
            <div className="flex items-center justify-end space-x-2">
                <nav className="flex items-center space-x-2">
                   {loading ? (
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-9 w-9 rounded-full" />
                      </div>
                    ) : isAuthenticated ? (
                        <>
                            <NotificationsBell />
                            <UserNav />
                        </>
                    ) : (
                       !isAdminPage && (
                         <div className="hidden md:flex items-center gap-2">
                            <Button asChild>
                                <Link href="/login">Iniciar Sesión</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/register">Registrarse</Link>
                            </Button>
                        </div>
                       )
                    )}
                </nav>
            </div>
        </div>
      </div>
    </header>
  );
}
