// ViewModel pour l'authentification

import { useState } from 'react';
import { login } from '../services/authService';

export const useAuthViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await login(email, password);
      setLoading(false);
      return data; // Peut inclure l'utilisateur connecté ou un token
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion.');
      setLoading(false);
      throw err;
    }
  };

  return {
    handleLogin,
    loading,
    error,
  };
};
