import React, { createContext, useState, useContext, useEffect } from 'react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('intellicoreUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // PRE-WARM SERVER: Start waking up Render immediately
    fetch('https://intellicore-ai-ro40.onrender.com/api/test').catch(() => {});

    // Initialize Google Auth for mobile
    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize();
    }
  }, []);

  // Force production URL for Capacitor/Mobile
  const API_URL = 'https://intellicore-ai-ro40.onrender.com';
  
  useEffect(() => {
    console.log('📱 MOBILE APP API TARGET:', API_URL);
  }, []);
  
  useEffect(() => {
    if (API_URL) console.log('🚀 INTELLICORE API URL:', API_URL);
  }, [API_URL]);

  const login = async (email, password) => {
    setIsAuthLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      const stored = localStorage.getItem('intellicoreUser');
      const existingAvatar = stored ? JSON.parse(stored).avatar : null;
      const userData = { ...data, avatar: existingAvatar || null };
      setUser(userData);
      localStorage.setItem('intellicoreUser', JSON.stringify(userData));
      setIsAuthLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password, avatar = null) => {
    setIsAuthLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed');
      const userData = { ...data, avatar: avatar || null };
      setUser(userData);
      localStorage.setItem('intellicoreUser', JSON.stringify(userData));
      setIsAuthLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      setIsAuthLoading(false);
      return { success: false, error: error.message };
    }
  };

  const updateAvatar = (avatarBase64) => {
    const updated = { ...user, avatar: avatarBase64 };
    setUser(updated);
    localStorage.setItem('intellicoreUser', JSON.stringify(updated));
  };

  const oauthLogin = async (googleData) => {
    try {
      let userData;
      
      // If native mobile, the data comes from Capacitor plugin
      if (Capacitor.isNativePlatform()) {
        const nativeUser = await GoogleAuth.signIn();
        userData = {
          id: `google-${nativeUser.email}`,
          name: nativeUser.name,
          email: nativeUser.email,
          avatar: nativeUser.imageUrl || null,
          authProvider: 'google'
        };
      } else {
        // Standard web data from @react-oauth/google
        userData = {
          id: `google-${googleData.email}`,
          name: googleData.name,
          email: googleData.email,
          avatar: googleData.picture || null,
          authProvider: 'google'
        };
      }

      setUser(userData);
      localStorage.setItem('intellicoreUser', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Google Auth Error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('intellicoreUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, oauthLogin, updateAvatar, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
