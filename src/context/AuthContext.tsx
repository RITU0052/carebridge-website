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
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string; code?: string }>;
  sendOtp: (email: string, purpose?: 'login' | 'signup') => Promise<{ success: boolean; message?: string; code?: string }>;
  verifyOtp: (email: string, code: string, purpose?: 'login' | 'signup') => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, pass: string, role: string) => Promise<{ success: boolean; message?: string; code?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (code: string, targetEmail?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('carebridge_session_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed. Please check your credentials.', code: data.code };
    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
      return { success: false, message: 'Server communication error during login.' };
    }
  };

  const sendOtp = async (email: string, purpose: 'login' | 'signup' = 'login') => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose }),
      });
      const data = await res.json();
      return { success: data.success, message: data.message, code: data.code };
    } catch (err) {
      console.error('Send OTP error:', err);
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  };

  const verifyOtp = async (email: string, code: string, purpose: 'login' | 'signup' = 'login') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode: code, purpose }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('carebridge_session_user', JSON.stringify(data.user));
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Invalid or expired OTP code.' };
    } catch (err) {
      console.error('Verify OTP error:', err);
      setIsLoading(false);
      return { success: false, message: 'Server error verifying OTP code.' };
    }
  };

  const signup = async (name: string, email: string, pass: string, role: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, role, purpose: 'signup' }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Signup request failed.', code: data.code };
    } catch (err) {
      console.error('Signup error:', err);
      setIsLoading(false);
      return { success: false, message: 'Server communication error during signup.' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return { success: data.success, message: data.message };
    } catch (err) {
      console.error('Forgot password error:', err);
      return { success: false, message: 'Failed to send password reset request.' };
    }
  };

  const verifyEmail = async (code: string, targetEmail?: string) => {
    const emailToVerify = targetEmail || user?.email;
    if (!emailToVerify) {
      return { success: false, message: 'No pending email address found for verification.' };
    }
    return await verifyOtp(emailToVerify, code, 'signup');
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
        sendOtp,
        verifyOtp,
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
