import { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from "../services/firebaseConfig";
import { getDoc, setDoc, doc } from "firebase/firestore";

export const useAuthViewModel = () => {

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

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

  // Observer l'état de connexion Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);


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

    if (field === "email") {
      value = value.toLowerCase(); // 🔥 Convertir en minuscule
    }

    setErrors((prev) => ({
      ...prev,
      [field]: errorMsg || undefined, // Stocke l'erreur seulement si elle existe
    }));

    setInputs((prev) => ({
      ...prev,
      [field]: value, // 🔥 Toujours mettre à jour l'input même si une erreur existe
    }));
  };

  // 🔥 Récupère l'utilisateur depuis Firebase et Firestore
  const fetchUserData = async (firebaseUser: any) => {
    if (!firebaseUser) {
      setUser(null);
      setToken(null);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const token = await firebaseUser.getIdToken(true);

      if (userDoc.exists()) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          token,
          ...userDoc.data(),
        });
        setToken(token);
      } else {
        console.warn("⚠️ Utilisateur non trouvé dans Firestore.");
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("❌ Erreur récupération des données Firestore:", error);
    }
  };

  // 🛠️ Observer l'état de connexion Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      await fetchUserData(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);



  // Fonction de connexion avec Firebase
  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const email = inputs.email.trim().toLowerCase(); // 🔥 Nettoyage email
      const userCredential = await signInWithEmailAndPassword(auth, email, inputs.password);
      const user = userCredential.user;

      if (!user) {
        throw new Error("Utilisateur introuvable.");
      }

      // 🔥 Récupération du token Firebase
      const token = await user.getIdToken(true);
      console.log("🔥 Token après connexion :", token);

      // 🔥 Récupération des infos utilisateur depuis Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        throw new Error("Utilisateur introuvable dans la base.");
      }

      const userData = userDoc.data();
      setUser({
        uid: user.uid,
        email: user.email,
        token,
        ...userData,
      });

      setRole(userData.role || "user"); // 🔥 Récupération du rôle
      setLoading(false);
      router.replace("/views/client/Home");
      return user;
    } catch (err: any) {
      console.error("❌ Erreur de connexion :", err);
      setError(err.message || "Une erreur est survenue lors de la connexion.");
    }

    setLoading(false);
  };



  // Fonction d'inscription avec Firebase
  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      const email = inputs.email.trim().toLowerCase(); // 🔥 Normalisation email

      // ✅ Vérification si l'email est déjà utilisé
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        throw new Error("Cet email est déjà utilisé. Essayez de vous connecter.");
      }

      // ✅ Vérification du mot de passe
      if (inputs.password !== inputs.confirmpassword) {
        setErrors((prev) => ({ ...prev, confirmpassword: "Les mots de passe ne correspondent pas." }));
        throw new Error("Les mots de passe ne correspondent pas.");
      }

      // ✅ Création de l'utilisateur Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, inputs.password);
      const user = userCredential.user;

      if (!user) {
        throw new Error("Impossible de créer l'utilisateur.");
      }

      // 🔥 Stockage des infos utilisateur dans Firestore
      const userData = {
        uid: user.uid,
        email,
        firstName: inputs.firstName.trim(),
        lastName: inputs.lastName.trim(),
        address: inputs.address.trim(),
        phone: inputs.phone.trim(),
        role: "user",
        createdAt: new Date(),
      };

      await setDoc(doc(db, "users", user.uid), userData);

      setUser({ ...userData, token: await user.getIdToken(true) }); // 🔥 Ajout du token
      setRole("user");

      setLoading(false);
      router.replace("/views/client/Home");
      return user;
    } catch (err: any) {
      console.error("❌ Erreur d'inscription :", err);
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    }

    setLoading(false);
  };


  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
    } catch (err) {
      console.error("❌ Erreur lors de la déconnexion :", err);
    }
  };


  const translateFirebaseError = (code: string): string => {
    switch (code) {
      case "auth/email-already-in-use":
        return "Cet email est déjà utilisé. Essayez de vous connecter.";
      case "auth/invalid-email":
        return "L'adresse email est invalide. Vérifiez votre saisie.";
      case "auth/weak-password":
        return "Mot de passe trop faible. Minimum 6 caractères.";
      case "auth/wrong-password":
        return "Mot de passe incorrect. Réessayez ou réinitialisez-le.";
      case "auth/user-not-found":
        return "Aucun compte trouvé avec cet email.";
      case "auth/too-many-requests":
        return "Trop de tentatives. Réessayez plus tard.";
      default:
        return "Une erreur s'est produite. Vérifiez votre connexion internet.";
    }
  };



  const validateInput = (field: keyof typeof inputs, value: string): string | null => {
    switch (field) {
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Email invalide.";
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return "Email invalide.";
        }
        break;

      case "password":
        if (value.length < 6 || value.length > 20) {
          return "Le mot de passe doit contenir entre 6 et 20 caractères.";
        }
        if (/\s/.test(value)) {
          return "Le mot de passe ne doit pas contenir d'espaces.";
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
    handleLogout,
    user,
    token,
    loading,
    error,
    role,
    errors,
  };
};
