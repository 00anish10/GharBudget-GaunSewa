import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserPublic, UserRole, TokenResponse } from '../types/api';
import { authApi, userApi } from '../services/api';

interface AuthContextType {
  // Auth state
  user: UserPublic | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
  
  // Auth actions
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (email: string, fullName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { full_name?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  
  // Role checks
  isAdmin: boolean;
  isUser: boolean;
  isGuest: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: 'access_token',
  USER: 'user',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const loadAuth = async () => {
      const savedToken = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } catch {
          // Invalid stored data, clear it
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    
    loadAuth();
  }, []);

  const setAuth = useCallback((token: string, userData: UserPublic) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const login = async (email: string, password: string, isAdmin = false) => {
    const response = await authApi.login({ email, password, is_admin: isAdmin });
    const { access_token, user } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(access_token);
    setUser(user);
  };

  const adminLogin = async (email: string, password: string) => {
    await login(email, password, true);
  };

  const register = async (email: string, fullName: string, password: string) => {
    const response = await authApi.register({ email, full_name: fullName, password });
    const { access_token, user } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(access_token);
    setUser(user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API errors
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const response = await userApi.getProfile();
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch {
      // Token might be invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (data: { full_name?: string }) => {
    const response = await userApi.updateProfile(data);
    const userData = response.data;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await userApi.changePassword({ current_password: currentPassword, new_password: newPassword });
  };

  const userRole = user?.role || null;
  const isAdmin = userRole === 'admin';
  const isUser = userRole === 'user';
  const isGuest = !token;

  const hasRole = (roles: UserRole[]) => {
    if (!userRole) return false;
    return roles.includes(userRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        userRole,
        login,
        adminLogin,
        register,
        logout,
        refreshUser,
        updateProfile,
        changePassword,
        isAdmin,
        isUser,
        isGuest,
        hasRole,
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