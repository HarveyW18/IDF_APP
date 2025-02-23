import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from "../services/firebaseConfig";
import { getDoc, setDoc, doc } from "firebase/firestore";

export const useAuthViewModel = () => {
  // État pour la sélection entre "Connexion" et "Inscription"
  const [isConnexionSelected, setIsConnexionSelected] = useState(true);

  // État pour savoir si l'utilisateur est à l'étape suivante de l'inscription
  const [isNextStep, setIsNextStep] = useState(false);

  const [errors, setErrors] = useState<{ [key in keyof typeof inputs]?: string }>({});

  // État pour les champs du formulaire
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    confirmpassword: '',
    address: '',
    phone: '',
    lastName: "",
    firstName: "",
  });

  const isLoginDisabled = !inputs.email || !inputs.password || !!errors.email || !!errors.password;
  const isRegisterDisabled = Object.values(inputs).some(value => !value) || Object.values(errors).some(error => error);


  const isNextStepDisabled =
    !inputs.firstName.trim() ||
    !inputs.lastName.trim() ||
    !inputs.address.trim() ||
    !inputs.phone.trim();

  // État pour le rôle de l'utilisateur
  const [role, setRole] = useState<string | null>(null);

  // État pour gérer le chargement et les erreurs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gestionnaire pour basculer entre "Connexion" et "Inscription"
  const toggleConnexion = (isSelected: boolean) => {
    setIsConnexionSelected(isSelected);
    setIsNextStep(false); // Réinitialise l’étape si on bascule vers "Connexion"
  };

  // Gestionnaire pour passer à l'étape suivante
  const toggleNextStep = () => {
    let newErrors: { [key in keyof typeof inputs]?: string } = {};
    let hasError = false;

    // Vérifier si les champs de la première étape sont remplis
    ["firstName", "lastName", "address", "phone"].forEach((field) => {
      if (!inputs[field as keyof typeof inputs].trim()) {
        newErrors[field as keyof typeof inputs] = "Ce champ est obligatoire.";
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return; // 🔹 Empêche l'utilisateur de passer à l'étape suivante
    }

    setErrors({}); // 🔥 Efface les erreurs s'il n'y en a plus
    setIsNextStep(true);
  };


  // Mise à jour des champs du formulaire
  const updateInput = (field: keyof typeof inputs, value: string) => {
    const errorMsg = validateInput(field, value);

    setErrors((prev) => ({
      ...prev,
      [field]: errorMsg || undefined, // Stocke l'erreur seulement si elle existe
    }));

    setInputs((prev) => ({
      ...prev,
      [field]: value, // 🔥 Toujours mettre à jour l'input même si une erreur existe
    }));
  };



  // Fonction de connexion avec Firebase
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, inputs.email, inputs.password);
      const user = userCredential.user;

      // Récupérer les données utilisateur depuis Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setRole(userData.role);  // Affecter le rôle récupéré depuis Firestore
      } else {
        setError("Utilisateur introuvable.");
      }

      setLoading(false);
      return user;
    } catch (err: any) {
      setError(err.message || "Erreur de connexion.");
      setLoading(false);
      throw err;
    }
  };


  // Fonction d'inscription avec Firebase
  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    // Stocker toutes les erreurs détectées
    let newErrors: { [key in keyof typeof inputs]?: string } = {};
    let hasError = false;

    for (const field in inputs) {
      const errorMsg = validateInput(field as keyof typeof inputs, inputs[field as keyof typeof inputs]);
      if (errorMsg) {
        newErrors[field as keyof typeof inputs] = errorMsg;
        hasError = true;
      }
    }

    // Si une erreur existe, on les affiche et on arrête l'inscription
    if (hasError) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      if (inputs.password !== inputs.confirmpassword) {
        setErrors((prev) => ({ ...prev, confirmpassword: "Les mots de passe ne correspondent pas." }));
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, inputs.email, inputs.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: inputs.email,
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        address: inputs.address,
        phone: inputs.phone,
        role: "user",
        createdAt: new Date(),
      });

      setRole("user");
      setLoading(false);
      return user;
    } catch (err: any) {
      setError(err.message || "Erreur lors de l’inscription.");
      setLoading(false);
      throw err;
    }
  };

  const validateInput = (field: keyof typeof inputs, value: string): string | null => {
    switch (field) {
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Email invalide.";
        }
        if (/[^\w@.]/.test(value)) {  // Vérifie qu'il n'y a pas d'emojis ou caractères spéciaux interdits
          return "L'email ne doit contenir que des lettres, chiffres et '@ .'";
        }
        break;

      case "password":
        if (value.length < 6) {
          return "Le mot de passe doit contenir au moins 6 caractères.";
        }
        if (!/[A-Z]/.test(value) || !/[0-9]/.test(value) || !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          return "Le mot de passe doit contenir une majuscule, un chiffre et un caractère spécial.";
        }
        break;

      case "confirmpassword":
        if (value !== inputs.password) {
          return "Les mots de passe ne correspondent pas.";
        }
        break;

      case "phone":
        if (!/^\d{8,15}$/.test(value)) {
          return "Le numéro doit contenir entre 8 et 15 chiffres uniquement.";
        }
        break;

      case "firstName":
      case "lastName":
        if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(value)) {
          return "Ce champ ne doit contenir que des lettres.";
        }
        break;

      case "address":
        if (!/^[a-zA-Z0-9À-ÿ\s,'-]+$/.test(value)) {
          return "L'adresse contient des caractères invalides.";
        }
        break;

      default:
        return null;
    }
    return null;
  };

  return {
    isConnexionSelected,
    isNextStep,
    isNextStepDisabled,
    isLoginDisabled,
    isRegisterDisabled,
    toggleConnexion,
    toggleNextStep,
    inputs,
    updateInput,
    handleLogin,
    handleRegister,
    loading,
    error,
    role,
    errors,
  };
};
