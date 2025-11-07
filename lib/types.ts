// src/lib/types.ts

import type { User as FirebaseUser } from "firebase/auth";

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ACADEMY: "ACADEMY",
  COACH: "COACH",
  PARENT_PLAYER: "PARENT_PLAYER",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];


export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  name: string | null;
  academyId?: string;
  coachId?: string;
  playerId?: string; // Added to know where to redirect parents
  ageCategory?: string; // For parent/player role to filter notifications
}

export interface AppUser {
    id: string; // This is the UID from Firebase Auth
    email: string;
    role: UserRole;
    academyId?: string;
    coachId?: string;
    playerId?: string; // Add playerId here as well
    name: string; // Display name (e.g., Academy name or Coach name)
    academyName?: string;
}

export interface UserContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

export interface Academy {
  id: string;
  name: string;
  address: string; // Ubicación
  description: string;
  sport: string;
  ageCategory: string[];
  logoUrl?: string;
  coverImageUrl?: string;
  instagramUrl?: string;
  registrationUrl?: string;
  ownerUid?: string;
  adminUid?: string; // To link to the AppUser
  isActive?: boolean;
}

export interface Coach {
    id?: string;
    name: string;
    academyId: string;
    academyName?: string;
    photoUrl?: string;
    technicalProfile?: string;
    uid?: string; // To link to the AppUser
}

export interface Player {
  id: string;
  name: string;
  academyId: string;
  academyName?: string;
  ageCategory: string;
  position: string;
  shirtNumber?: string;
  photoUrl?: string;
  dateOfBirth?: string;
  paymentDueDate?: string;
  linkedUsers?: { userId: string; relationType: string; }[];
  status?: 'active' | 'inactive';
  createdAt?: string;
  deregisteredAt?: string | null;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
  publishedDate: string;
  isActive?: boolean;
}

export interface TrainingDrill {
  drillName: string;
  drillDescription: string;
  drillDurationMinutes: number;
}

export type TrainingType = 'Técnico' | 'Táctico' | 'Físico' | 'Mixto' | 'Recuperación' | 'Arqueros';


export interface TrainingSession {
  id: string;
  trainingType: TrainingType;
  date: string; // ISO string for datetime
  academyId: string;
  academyName: string;
  coachId: string;
  coachName: string;
  ageCategory: string;
  location: string;
  objectives: string;
  attendees?: string[]; // Player IDs
  // Deprecated fields, kept for compatibility if needed.
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: string;
  sessionLengthMinutes?: number;
  drills?: TrainingDrill[];
  additionalNotes?: string;
}

export interface Tournament {
    id?: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    participatingAcademies: { id: string; name: string }[];
    status: 'planificado' | 'en_curso' | 'finalizado';
}

export interface Match {
  id: string;
  date: string; // ISO string for datetime
  academyId: string;
  academyName: string;
  coachId?: string; // Made optional as it might not be relevant for tournament matches
  coachName?: string;
  ageCategory: string;
  opponentType: 'internal' | 'external';
  opponentAcademyId?: string;
  opponentTeam: string; // Name of the opponent (either from Academy or manual input)
  location: string;
  tournament?: string;
  tournamentId?: string;
  academyScore: number;
  opponentScore: number;
}

export interface Lineup {
    id?: string;
    matchId: string;
    academyId: string;
    starters: string[];
    substitutes: string[];
    scorers: { playerId: string; goals: number }[];
    assists: { playerId: string; assists: number }[];
}

export interface Standing {
    teamId: string;
    teamName: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    tournamentId: string;
}


// Firestore Permission Error types
export type FirestoreOperation = 'get' | 'list' | 'create' | 'update' | 'delete';

export type SecurityRuleContext = {
  path: string;
  operation: FirestoreOperation;
  requestResourceData?: any;
};


export interface Sponsor {
  id: string;
  name: string;
  academyId: string;
  academyName: string;
  logoUrl: string;
  websiteUrl?: string;
}

export const BANNER_LOCATIONS = {
    home: "Página de Inicio",
    matches: "Página de Marcadores",
    academies: "Página de Academias",
    news: "Página de Noticias",
    ranking: "Página de Ranking",
} as const;

export type BannerLocation = keyof typeof BANNER_LOCATIONS;

export interface Banner {
    id: string;
    companyName: string;
    imageUrl: string;
    linkUrl?: string;
    locations: BannerLocation[];
    isActive: boolean;
}

export interface LinkRequest {
  id?: string;
  playerId: string;
  playerName: string;
  academyId: string;
  academyName?: string;
  userId: string;
  userName: string;
  relationType: string; // e.g., "Padre", "Madre", "Jugador"
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string; // ISO String
}

export interface Notification {
  id?: string;
  academyId: string;
  title: string;
  content: string;
  target: 'all_players' | 'all_coaches' | 'academy_admin' | string; // 'string' is for age category
  createdAt: string; // ISO String
  senderName: string;
  archivedBy?: string[]; // Array of user UIDs who have archived/deleted it
}
