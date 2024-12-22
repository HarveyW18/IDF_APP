import { useState } from 'react';
import { login, register } from '../services/authService';

export const useAuthViewModel = () => {
  // État pour la sélection entre "Connexion" et "Inscription"
  const [isConnexionSelected, setIsConnexionSelected] = useState(true);

  // État pour savoir si l'utilisateur est à l'étape suivante de l'inscription
  const [isNextStep, setIsNextStep] = useState(false);

  // État pour les champs du formulaire
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    address: '',
    phone: '',
  });

  // État pour gérer le chargement et les erreurs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gestionnaire pour basculer entre "Connexion" et "Inscription"
  const toggleConnexion = (isSelected: boolean) => {
    setIsConnexionSelected(isSelected);
    setIsNextStep(false); // Réinitialise l'étape si on bascule vers "Connexion"
  };

  // Gestionnaire pour passer à l'étape suivante
  const toggleNextStep = () => {
    setIsNextStep(!isNextStep);
  };

  // Mise à jour des champs du formulaire
  const updateInput = (field: keyof typeof inputs, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fonction de connexion
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(inputs.email, inputs.password); // Appel API
      setLoading(false);
      return data; // Succès : retourne les données de connexion
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion.');
      setLoading(false);
      throw err;
    }
  };

  // Fonction d'inscription
  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await register(inputs); // Appel API avec les données du formulaire
      setLoading(false);
      return data; // Succès : retourne la réponse d'inscription
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l’inscription.');
      setLoading(false);
      throw err;
    }
  };

  return {
    isConnexionSelected,
    isNextStep,
    toggleConnexion,
    toggleNextStep,
    inputs,
    updateInput,
    handleLogin,
    handleRegister,
    loading,
    error,
  };
};
