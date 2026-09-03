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
  sendOtp: (email: string) => Promise<{ success: boolean; message?: string; otpDemoCode?: string }>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, pass: string, role: string) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (code: string) => Promise<{ success: boolean; message?: string }>;
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
      return { success: false, message: data.message || 'Login failed. Please check your credentials.' };
    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
      return { success: false, message: 'Server communication error during login.' };
    }
  };

  const sendOtp = async (email: string) => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return { success: data.success, message: data.message, otpDemoCode: data.otpDemoCode };
    } catch (err) {
      console.error('Send OTP error:', err);
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  };

  const verifyOtp = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode: code }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('carebridge_session_user', JSON.stringify(data.user));
        return { success: true };
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
    await new Promise((res) => setTimeout(res, 400));

    if (!name || !email || !pass) {
      setIsLoading(false);
      return { success: false, message: 'All required fields must be filled.' };
    }

    const newUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: role || 'Caregiver',
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem('carebridge_session_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
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

  const verifyEmail = async (code: string) => {
    await new Promise((res) => setTimeout(res, 300));
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
