import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('intellicoreUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : `http://${window.location.hostname}:3001`;

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      // Preserve avatar from localStorage if it exists (avatar is stored locally)
      const stored = localStorage.getItem('intellicoreUser');
      const existingAvatar = stored ? JSON.parse(stored).avatar : null;
      const userData = { ...data, avatar: existingAvatar || null };
      setUser(userData);
      localStorage.setItem('intellicoreUser', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password, avatar = null) => {
    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed');
      // Store avatar (base64) locally alongside user data
      const userData = { ...data, avatar: avatar || null };
      setUser(userData);
      localStorage.setItem('intellicoreUser', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateAvatar = (avatarBase64) => {
    const updated = { ...user, avatar: avatarBase64 };
    setUser(updated);
    localStorage.setItem('intellicoreUser', JSON.stringify(updated));
  };

  const oauthLogin = (googleData) => {
    const userData = {
      id: `google-${googleData.email}`,
      name: googleData.name,
      email: googleData.email,
      avatar: googleData.picture || null,
      authProvider: 'google'
    };
    setUser(userData);
    localStorage.setItem('intellicoreUser', JSON.stringify(userData));
    return { success: true };
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
