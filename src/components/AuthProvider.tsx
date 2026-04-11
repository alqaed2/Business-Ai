import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, Tenant } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  tenant: Tenant | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch profile
        const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (profileDoc.exists()) {
          const profileData = profileDoc.data() as UserProfile;
          setProfile(profileData);
          
          // Fetch tenant
          const tenantDoc = await getDoc(doc(db, 'tenants', profileData.tenantId));
          if (tenantDoc.exists()) {
            setTenant({ id: tenantDoc.id, ...tenantDoc.data() } as Tenant);
          }
        } else {
          // New user - create default tenant and profile for demo purposes
          // In a real app, this would be a signup flow
          const newTenantId = `tenant_${firebaseUser.uid}`;
          const newTenant: Tenant = {
            id: newTenantId,
            name: "My Business",
            plan: 'starter',
            createdAt: new Date().toISOString(),
          };
          
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            tenantId: newTenantId,
            role: 'admin',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
          };

          await setDoc(doc(db, 'tenants', newTenantId), {
            name: newTenant.name,
            plan: newTenant.plan,
            createdAt: newTenant.createdAt
          });
          await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
          
          setProfile(newProfile);
          setTenant(newTenant);
        }
      } else {
        setProfile(null);
        setTenant(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = () => auth.signOut();

  return (
    <AuthContext.Provider value={{ user, profile, tenant, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
