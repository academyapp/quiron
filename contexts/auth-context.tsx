// contexts/auth-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROLES, UserProfile, AppUser } from "@/lib/types";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from "firebase/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  login: (email: string, pass: string) => Promise<UserProfile | null>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchUserProfile = async (firebaseUser: FirebaseUser): Promise<UserProfile | null> => {
  try {
    // Force refresh to get the latest claims.
    const idTokenResult = await firebaseUser.getIdTokenResult(true);
    let userRole = idTokenResult.claims.role as string | undefined;

    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.warn(`User document not found in Firestore for UID: ${firebaseUser.uid}`);
      // If role is not in claims and doc doesn't exist, we can't proceed.
      if (!userRole) return null;
    }
    
    const appUserData = userDocSnap.data() as AppUser | undefined;

    // If role is not in the token, try to get it from the Firestore document (for backward compatibility)
    if (!userRole && appUserData) {
      userRole = appUserData.role;
    }
    
    if (!userRole) {
        console.warn(`User role not found in claims or Firestore for UID: ${firebaseUser.uid}.`);
        return null;
    }

    let playerAgeCategory: string | undefined;
    if (appUserData?.role === ROLES.PARENT_PLAYER && appUserData.playerId) {
        try {
          const playerRef = doc(db, "players", appUserData.playerId);
          const playerSnap = await getDoc(playerRef);
          if (playerSnap.exists()) {
              playerAgeCategory = playerSnap.data().ageCategory;
          }
        } catch(e) {
          console.error("Could not fetch player profile for user", e);
        }
    }
    
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: appUserData?.name || firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: userRole as UserProfile["role"],
        academyId: appUserData?.academyId,
        coachId: appUserData?.coachId,
        playerId: appUserData?.playerId,
        ageCategory: playerAgeCategory,
        name: appUserData?.name || firebaseUser.displayName,
    };

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userProfile = await fetchUserProfile(firebaseUser);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<UserProfile | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      // The onAuthStateChanged listener will handle fetching and setting the profile.
      // We can await the profile fetch here as well to return it immediately.
      const userProfile = await fetchUserProfile(userCredential.user);
      if(userProfile){
        setProfile(userProfile);
        return userProfile;
      }
      // This indicates a problem (e.g. user exists in Auth but not in Firestore)
      // but we shouldn't automatically sign them out.
      return null;
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    } finally {
        setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
    router.push("/");
  };
  
  const isAuthenticated = !!profile;

  return (
    <AuthContext.Provider value={{ isAuthenticated, profile, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
