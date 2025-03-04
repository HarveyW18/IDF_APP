import { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { auth, db } from "../services/firebaseConfig";
import { getDoc, setDoc, doc } from "firebase/firestore";

export const useAuthViewModel = () => {
  const router = useRouter();
  const segments = useSegments();

  // ✅ Vérifier que `segments` contient bien des valeurs
  const [role, setRole] = useState<string | null>(null);

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // État pour connexion/inscription
  const [isConnexionSelected, setIsConnexionSelected] = useState(true);
  const [isNextStep, setIsNextStep] = useState(false);
  const [isNextStepDisabled, setIsNextStepDisabled] = useState(true); // ✅ Défini avec useState

  const [errors, setErrors] = useState<{ [key in keyof typeof inputs]?: string }>({});

  // Champs du formulaire
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

  // Gestion du chargement et des erreurs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Observer l'état de connexion Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserData(firebaseUser);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const currentPath = segments.join("/");

    if (currentPath.includes("authagent")) {
      setRole("agent");
    } else {
      setRole("user");
    }
  }, [segments]);


  const updateInput = (field: keyof typeof inputs, value: string) => {
    console.log(`📝 Modification du champ: ${field} -> ${value}`);

    setInputs((prev) => {
      const updatedInputs = { ...prev, [field]: value };

      const nextStepDisabled =
        !updatedInputs.firstName.trim().length ||
        !updatedInputs.lastName.trim().length ||
        !updatedInputs.address.trim().length ||
        !updatedInputs.phone.trim().length;

      console.log(`🚦 nextStepDisabled: ${nextStepDisabled}`);
      setIsNextStepDisabled(nextStepDisabled);

      return updatedInputs;
    });
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[\W_]/.test(password); // Vérifie les caractères spéciaux

    return { minLength, hasUppercase, hasSpecialChar };
  };

  const validateInputs = () => {
    let newErrors: { [key in keyof typeof inputs]?: string } = {};

    if (!inputs.firstName.trim()) newErrors.firstName = "Le prénom est requis.";
    if (!inputs.lastName.trim()) newErrors.lastName = "Le nom est requis.";
    if (!inputs.address.trim()) newErrors.address = "L'adresse est requise.";
    if (!inputs.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis.";
    } else if (!/^\d{10}$/.test(inputs.phone)) {
      newErrors.phone = "Le numéro de téléphone doit contenir 10 chiffres.";
    }

    // Validation du mot de passe
    const passwordValidation = validatePassword(inputs.password);
    if (!passwordValidation.minLength) newErrors.password = "Minimum 8 caractères.";
    if (!passwordValidation.hasUppercase) newErrors.password = "1 majuscule requise.";
    if (!passwordValidation.hasSpecialChar) newErrors.password = "1 caractère spécial requis.";

    // Vérification de la confirmation du mot de passe
    if (inputs.password !== inputs.confirmpassword) {
      newErrors.confirmpassword = "Les mots de passe ne correspondent pas.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const toggleNextStep = () => {
    if (validateInputs()) {
      setIsNextStep(true);
    }
  };

  // Récupère l'utilisateur depuis Firestore et vérifie son rôle
  const fetchUserData = async (firebaseUser: any) => {
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const token = await firebaseUser.getIdToken(true);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("🔥 Token :", token);
        console.log("🔥 Données utilisateur récupérées :", userData);
        console.log("👤 Rôle Firestore :", userData.role);

        // ✅ Met à jour le rôle dynamiquement
        setRole(userData.role);

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          token,
          ...userData,
        });
        setToken(token);
      } else {
        console.warn("⚠️ Utilisateur non trouvé dans Firestore.");
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("❌ Erreur récupération des données Firestore:", error);
      setError("Erreur lors de la récupération des données.");
    }
  };



  // Connexion Firebase
  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const email = inputs.email.trim().toLowerCase();
      const userCredential = await signInWithEmailAndPassword(auth, email, inputs.password);
      const user = userCredential.user;

      if (!user) {
        throw new Error("Utilisateur introuvable.");
      }

      await fetchUserData(user);
      setLoading(false);

      // 🔥 Attendre que le rôle soit mis à jour avant de rediriger
      if (role) {
        router.replace(role === "user" ? "/views/client/Home" : "/views/agent/Home");
      }
    } catch (err: any) {
      console.error("❌ Erreur de connexion :", err);
      setError(err.message || "Une erreur est survenue lors de la connexion.");
      setLoading(false);
    }
  };


  // Inscription Firebase
  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      const email = inputs.email.trim().toLowerCase();

      // Vérifier si l'email est déjà utilisé
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        throw new Error("Cet email est déjà utilisé. Essayez de vous connecter.");
      }

      // Vérifier si les mots de passe correspondent
      if (inputs.password !== inputs.confirmpassword) {
        setErrors((prev) => ({ ...prev, confirmpassword: "Les mots de passe ne correspondent pas." }));
        throw new Error("Les mots de passe ne correspondent pas.");
      }

      // Création utilisateur Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, inputs.password);
      const user = userCredential.user;

      if (!user) {
        throw new Error("Impossible de créer l'utilisateur.");
      }

      // Enregistrement Firestore avec le rôle approprié
      const userData = {
        uid: user.uid,
        email,
        firstName: inputs.firstName.trim(),
        lastName: inputs.lastName.trim(),
        address: inputs.address.trim(),
        phone: inputs.phone.trim(),
        role,
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", user.uid), userData);

      setUser({ ...userData, token: await user.getIdToken(true) });
      setLoading(false);

      // 🔥 Redirection après inscription
      router.replace(role === "user" ? "/views/client/Home" : "/views/agent/Home");
    } catch (err: any) {
      console.error("❌ Erreur d'inscription :", err);
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
      setLoading(false);
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
    } catch (err) {
      console.error("❌ Erreur lors de la déconnexion :", err);
    }
  };

  return {
    role,
    isConnexionSelected,
    isNextStep,
    isNextStepDisabled,
    isLoginDisabled,
    isRegisterDisabled,
    toggleConnexion: setIsConnexionSelected,
    toggleNextStep: () => setIsNextStep(true),
    inputs,
    updateInput: (field: keyof typeof inputs, value: string) => setInputs((prev) => ({ ...prev, [field]: value })),
    validatePassword,
    handleLogin,
    handleRegister,
    handleLogout,
    user,
    token,
    loading,
    error,
    errors,
  };
};
