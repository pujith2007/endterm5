import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('crewup_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('crewup_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('crewup_token');
      if (savedToken) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data.user);
          localStorage.setItem('crewup_user', JSON.stringify(res.data.user));
        } catch {
          // Token invalid
          localStorage.removeItem('crewup_token');
          localStorage.removeItem('crewup_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('crewup_token', receivedToken);
    localStorage.setItem('crewup_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return res.data;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('crewup_token', receivedToken);
    localStorage.setItem('crewup_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('crewup_token');
    localStorage.removeItem('crewup_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updateData) => {
    const res = await authAPI.updateProfile(updateData);
    const updatedUser = res.data.user;
    setUser(updatedUser);
    localStorage.setItem('crewup_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
      localStorage.setItem('crewup_user', JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
