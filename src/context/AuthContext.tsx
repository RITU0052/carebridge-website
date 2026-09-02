'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, pass: string, role: string) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (code: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Deterministic initial state on both Server and Client Initial Render to prevent hydration mismatch
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedUser = localStorage.getItem('carebridge_session_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error restoring session:', err);
      } finally {
        setIsLoading(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    if (!email || !pass) {
      setIsLoading(false);
      return { success: false, message: 'Please provide both email and password.' };
    }

    if (pass.length < 6) {
      setIsLoading(false);
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const mockUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      email,
      role: 'Caregiver',
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    localStorage.setItem('carebridge_session_user', JSON.stringify(mockUser));
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (name: string, email: string, pass: string, role: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    if (!name || !email || !pass) {
      setIsLoading(false);
      return { success: false, message: 'All required fields must be filled.' };
    }

    const mockUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: role || 'Caregiver',
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    localStorage.setItem('carebridge_session_user', JSON.stringify(mockUser));
    setIsLoading(false);
    return { success: true };
  };

  const forgotPassword = async (email: string) => {
    await new Promise((res) => setTimeout(res, 500));
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    return {
      success: true,
      message: `Password reset instructions sent to ${email}. Please check your inbox.`,
    };
  };

  const verifyEmail = async (code: string) => {
    await new Promise((res) => setTimeout(res, 500));
    if (!code || code.trim().length < 4) {
      return { success: false, message: 'Please enter a valid verification code.' };
    }

    if (user) {
      const updatedUser = { ...user, isVerified: true };
      setUser(updatedUser);
      localStorage.setItem('carebridge_session_user', JSON.stringify(updatedUser));
    }
    return { success: true, message: 'Email address verified successfully!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('carebridge_session_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        forgotPassword,
        verifyEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
