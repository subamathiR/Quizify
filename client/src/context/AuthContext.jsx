import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const token = localStorage.getItem('quizify_token');
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          localStorage.removeItem('quizify_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedInUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('quizify_token', res.data.token);
      setUser(res.data);
      showToast(`Welcome back, ${res.data.name}! 👋`, 'success');
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authAPI.register({ name, email, password });
      localStorage.setItem('quizify_token', res.data.token);
      setUser(res.data);
      showToast(`Account created successfully! Welcome to Quizify 🎉`, 'success');
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('quizify_token');
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = async (data) => {
    try {
      const res = await userAPI.updateProfile(data);
      setUser((prev) => ({ ...prev, ...res.data }));
      showToast('Profile updated successfully!', 'success');
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, toast, showToast }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
