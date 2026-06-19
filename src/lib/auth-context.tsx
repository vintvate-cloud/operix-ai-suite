"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";

export type UserData = {
  uid: string;
  email: string;
  businessName?: string;
  businessType?: string;
  modules?: string[];
  createdAt: number;
  onboardingComplete: boolean;
};

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isTrialExpired: boolean;
  activeProperty: string | null;
  setActiveProperty: (id: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isTrialExpired: false,
  activeProperty: null,
  setActiveProperty: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeProperty, setActiveProperty] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeDoc: () => void;
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            setUserData(null);
          }
          setLoading(false);
        });
      } else {
        setUserData(null);
        setLoading(false);
        if (unsubscribeDoc) unsubscribeDoc();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const isTrialExpired = userData ? (Date.now() - userData.createdAt) > 7 * 24 * 60 * 60 * 1000 : false;

  return (
    <AuthContext.Provider value={{ user, userData, loading, isTrialExpired, activeProperty, setActiveProperty }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
