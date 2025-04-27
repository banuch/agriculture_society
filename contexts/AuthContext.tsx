import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '@/config/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter, useSegments } from 'expo-router';

// User types
export type UserRole = 'farmer' | 'buyer' | 'admin';

export interface UserData {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  location?: {
    address?: string;
    pincode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  createdAt: Date;
}

// Context type
interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<UserData>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // Get additional user data from Firestore
        try {
          const userDocRef = doc(db, 'users', authUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            console.log('No user data found in Firestore');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (!user && !inAuthGroup) {
      // If not logged in and not in auth group, redirect to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // If logged in and in auth group, redirect to home
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  // Sign up
  const signUp = async (email: string, password: string, newUserData: Partial<UserData>) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;
      
      // Create user document in Firestore
      const userData: UserData = {
        id: uid,
        email,
        role: newUserData.role || 'buyer',
        name: newUserData.name || '',
        phone: newUserData.phone,
        location: newUserData.location,
        createdAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', uid), userData);
      setUserData(userData);
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  // Update user data
  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, data, { merge: true });
      
      // Update local state
      if (userData) {
        setUserData({ ...userData, ...data });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  const value = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};