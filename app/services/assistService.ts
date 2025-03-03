// services/assistanceService.ts
import { getFirebaseToken, db } from "./firebaseConfig";
import { Assistance } from "../models/Assistance";
import { doc, getDoc } from "firebase/firestore";

export const BASE_API_URL = "http://192.168.1.190:7595/api";

/**
 * 🔥 Envoie une demande d'assistance PMR au backend
 */
export const creerReservationAssistance = async (token: string, reservationData: any) => {
    try {
        const response = await fetch(`${BASE_API_URL}/Reservation/demande-assistance`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(reservationData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erreur lors de la création de la réservation");
        }

        console.log("✅ Réservation réussie :", data);
        return data;
    } catch (error) {
        console.error("❌ Erreur création réservation :", error);
        return null;
    }
};

/**
 * 🔥 Récupère tous les trajets disponibles
 */
export const fetchAllAssistances = async (): Promise<Assistance[]> => {
    try {
        const token = await getFirebaseToken();
        if (!token) throw new Error("Impossible de récupérer le token Firebase.");

        const response = await fetch(`${BASE_API_URL}/Trajet/all-trajets`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🔍 Réponse brute API :", response);

        if (!response.ok) throw new Error("Erreur de récupération des trajets.");
        const trajets = await response.json();
        console.log("🚀 Trajets reçus :", trajets);

        // ✅ Fonction pour éviter les erreurs d'accès aux clés undefined
        const safeGet = (obj: any, key: string, defaultValue: string = "Inconnu") => {
            return obj && obj[key] ? obj[key] : defaultValue;
        };

        const assistanceData = await Promise.all(
            trajets.map(async (trajet: any) => {
                console.log("🚀 Trajet en cours de traitement :", trajet);

                // ✅ Vérification si `firebaseUid` existe
                if (!trajet.firebaseUid) {
                    console.warn(`⚠️ Trajet sans firebaseUid, ignoré :`, trajet);
                    return null;
                }

                if (!trajet.dateHeureDepart) {
                    console.warn("⚠️ Attention : `dateHeureDepart` manquant pour ce trajet :", trajet);
                }

                try {
                    const userRef = doc(db, "users", trajet.firebaseUid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        return {
                            id: safeGet(trajet, "id"),
                            numeroMMT: safeGet(trajet, "numeroMMT"),
                            firebaseUid: safeGet(trajet, "firebaseUid"),
                            pmrName: `${safeGet(userData, "firstName")} ${safeGet(userData, "lastName")}`,
                            pmrAvatarUrl: safeGet(userData, "avatarUrl", "https://via.placeholder.com/60"),
                            disabilityType: safeGet(userData, "disabilityType", "Non spécifié"),
                            departure: safeGet(trajet, "lieuDepart"),
                            destination: safeGet(trajet, "lieuArrivee"),
                            time: safeGet(trajet, "dateHeureDepart"),
                            status: "en attente" // Ajout par défaut
                        };
                    } else {
                        console.warn(`⚠️ Aucune donnée pour l'utilisateur ${trajet.firebaseUid}`);
                        return null;
                    }
                } catch (error) {
                    console.error(`❌ Erreur lors de la récupération des données utilisateur Firebase :`, error);
                    return null;
                }
            })
        );

        return assistanceData.filter((item) => item !== null) as Assistance[];
    } catch (error) {
        console.error("❌ Erreur API:", error);
        return [];
    }
};
