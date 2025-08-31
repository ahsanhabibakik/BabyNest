import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from './authService';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setUser, setInitialized, user } = useAuthStore();

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setInitialized(true);
    });

    // Check if there's already a current user (for refreshes/app restarts)
    const currentUser = authService.getCurrentUser();
    if (currentUser && !user) {
      setUser(currentUser);
    }
    setInitialized(true);

    return unsubscribe;
  }, [setUser, setInitialized, user]);

  return <>{children}</>;
};