// services/assistanceService.ts
import { getFirebaseToken, db } from "./firebaseConfig";
import { Assistance } from "../models/Assistance";
import { doc, getDoc } from "firebase/firestore";

export const BASE_API_URL = "http://192.168.1.151:7595/api";

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

        const response = await fetch(`${BASE_API_URL}/Reservation/all-reservations`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(`
            curl --location '${BASE_API_URL}/Reservation/all-reservations' \\
            --header 'Content-Type: application/json' \\
            --header 'Authorization: Bearer ${token}' \\'
        `);

        console.log("🔍 Réponse brute API :", response);

        if (!response.ok) throw new Error("Erreur de récupération des réservations.");
        const reservations = await response.json();
        console.log("🚀 Réservations reçues :", reservations);

        // ✅ Fonction pour éviter les erreurs d'accès aux clés undefined
        const safeGet = (obj: any, key: string, defaultValue: string = "Inconnu") => {
            return obj && obj[key] !== undefined ? obj[key] : defaultValue;
        };

        const assistanceData = await Promise.all(
            reservations.map(async (reservation: any) => {
                console.log("🚀 Réservation en cours de traitement :", reservation);

                // ✅ Vérification de `Nom` et `Prenom`
                if (!reservation.nom || !reservation.prenom) {
                    console.warn(`⚠️ Réservation sans nom/prénom, ignorée :`, reservation);
                    return null;
                }

                try {
                    return {
                        id: safeGet(reservation, "id"),
                        numeroMMT: safeGet(reservation, "numeroMMT"),
                        pmrName: `${safeGet(reservation, "nom")} ${safeGet(reservation, "prenom")}`,
                        departure: safeGet(reservation, "lieuDepart"),
                        destination: safeGet(reservation, "lieuArrivee"), // 🛠 Correction ici
                        typeTransport: safeGet(reservation, "typeTransport"), // 🛠 Correction ici
                        time: safeGet(reservation, "dateHeureDepart"),
                        arrivalTime: safeGet(reservation, "dateHeureArrivee"),
                        duration: safeGet(reservation, "dureeTotaleEnSecondes"), // 🛠 Correction ici
                        distance: safeGet(reservation, "distanceTotale"), // 🛠 Correction ici
                        assistancePMR: safeGet(reservation, "assistancePMR"),
                        handicapType: safeGet(reservation, "typeHandicap"),
                        price: safeGet(reservation, "prix"), // 🛠 Correction ici
                        sections: reservation.sections?.map((section: any) => ({
                            modeTransport: safeGet(section, "modeTransport"),
                            depart: safeGet(section, "depart"),
                            arrivee: safeGet(section, "arrivee"),
                            price: safeGet(section, "prix"),
                            departureTime: safeGet(section, "dateHeureDepart"),
                            arrivalTime: safeGet(section, "dateHeureArrivee"),
                        })) || [],
                        status: "en attente", // Ajout d'un statut par défaut
                    };
                } catch (error) {
                    console.error(`❌ Erreur lors du traitement de la réservation :`, error);
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