// services/assistanceService.ts
import { getFirebaseToken, db } from "./firebaseConfig";
import { Assistance } from "../models/Assistance";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface APIReservation {
    id: number | string;
    nom: string;
    prenom: string;
    status: string;
    lieuDepart: string;
    lieuArrivee: string;
    typeTransport: string;
    dateHeureDepart: string;
    dateHeureArrivee: string;
    dureeTotaleEnSecondes?: number;
    prix?: number;
    sections?: {
        modeTransport: string;
        depart: string;
        arrivee: string;
        prix: number;
        dateHeureDepart: string;
        dateHeureArrivee: string;
    }[];
}


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

        const response = await fetch(`${BASE_API_URL}/Reservation/all-reservations`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erreur de récupération des réservations.");
        const reservations = await response.json();

        return reservations.map((item: any) => ({
            id: Number(item.id || 0), // ✅ Sécurisation
            pmrName: `${item.nom ?? "Inconnu"} ${item.prenom ?? "Inconnu"}`.trim(),
            status: item.status === "accepted" ? "accepted" : "pending",
            departure: item.lieuDepart ?? "Lieu inconnu",
            destination: item.lieuArrivee ?? "Lieu inconnu",
            typeTransport: item.typeTransport ?? "Non spécifié",
            time: item.dateHeureDepart ?? "",
            arrivalTime: item.dateHeureArrivee ?? "",
            duration: Number(item.dureeTotaleEnSecondes || 0),
            price: Number(item.prix || 0),
            sections: item.sections?.map((section: any) => ({
                modeTransport: section.ModeTransport ?? "Non spécifié",
                depart: section.Depart ?? "Non spécifié",
                arrivee: section.Arrivee ?? "Non spécifié",
                price: Number(section.Prix ?? 0),
                departureTime: section.DateHeureDepart ?? "",
                arrivalTime: section.DateHeureArrivee ?? "",
            })) || [],
        }));
    } catch (error) {
        console.error("❌ Erreur API:", error);
        return []; // ✅ Retourne un tableau vide au lieu d'undefined
    }
};

export const fetchPendingAssistances = async (): Promise<Assistance[]> => {
    try {
        console.log("🔍 fetchPendingAssistances() - Début");
        const token = await getFirebaseToken();
        if (!token) throw new Error("Impossible de récupérer le token Firebase.");
        console.log(`✅ Token Firebase récupéré : ${token.substring(0, 10)}...`);

        const response = await fetch(`${BASE_API_URL}/Reservation/pending-reservations`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(`📩 Réponse API (Status: ${response.status})`);

        if (!response.ok) throw new Error("Erreur de récupération des réservations en attente.");
        const reservations = await response.json();
        console.log("📜 Réponse brute reçue :", reservations);
        console.log("🚀 Réservations en attente traitées :", reservations);


        return reservations.map((item: any) => {
            const convertedStatus = item.status === "pending" ? "pending" : "accepted"; // ✅ Assurer cohérence avec le modèle
        
            console.log(`✅ ID ${item.id} - Status avant: ${item.status}, après conversion: ${convertedStatus}`);
        
            return {
                id: Number(item.id),
                pmrName: `${item.nom} ${item.prenom}`.trim(),
                status: convertedStatus,  
                departure: item.lieuDepart,
                destination: item.lieuArrivee,
                typeTransport: item.typeTransport,
                time: item.dateHeureDepart,
                arrivalTime: item.dateHeureArrivee,
                duration: Number(item.dureeTotaleEnSecondes || "0"),
                price: Number(item.prix || "0"),
                sections: item.sections.map((section: any) => ({
                    modeTransport: section.modeTransport,
                    depart: section.depart,
                    arrivee: section.arrivee,
                    price: Number(section.prix),
                    departureTime: section.dateHeureDepart,
                    arrivalTime: section.dateHeureArrivee,
                })),
            };
        });
        
        
    } catch (error) {
        console.error("❌ Erreur API:", error);
        return [];
    }
};



/**
 * 🔥 Accepter une réservation (Agent)
 */
export const accepterReservation = async (reservationId: number) => {
    try {
        const token = await getFirebaseToken();
        if (!token) throw new Error("Impossible de récupérer le token Firebase.");

        const response = await fetch(`${BASE_API_URL}/Reservation/accepter-reservation/${reservationId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const text = await response.text();
        if (!response.ok) throw new Error(`Erreur lors de l'acceptation : ${text}`);

        const data = JSON.parse(text);
        console.log("✅ Réservation acceptée :", data);

        return { ...data, status: data.status === "accepted" ? "accepted" : data.status };
    } catch (error) {
        console.error("❌ Erreur acceptation :", error);
        return null;
    }
};


export const fetchAcceptedAssistances = async (firebaseUid: string): Promise<Assistance[]> => {
    try {
        console.log("🔍 fetchAcceptedAssistances() - Début");
        console.log(`👉 UID Firebase envoyé : ${firebaseUid}`);

        const token = await getFirebaseToken();
        if (!token) throw new Error("Impossible de récupérer le token Firebase.");
        console.log(`✅ Token Firebase récupéré : ${token.substring(0, 10)}...`);

        const response = await fetch(`${BASE_API_URL}/Reservation/accepted-reservations/${firebaseUid}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(`📩 Réponse API (Status: ${response.status})`);

        if (!response.ok) throw new Error("Erreur de récupération des réservations acceptées.");
        
        const reservations = await response.json();
        console.log("🚀 Réservations acceptées traitées :", reservations);

        return reservations.map((item: any) => {
            const convertedStatus = item.status === "pending" ? "pending" : "accepted"; 
            console.log(`✅ ID ${item.id} - Status avant: ${item.status}, après conversion: ${convertedStatus}`);

            return {
                id: Number(item.id),
                pmrName: `${item.nom} ${item.prenom}`.trim(),
                status: convertedStatus,  // ✅ Assurer la cohérence avec le modèle
                departure: item.lieuDepart,
                destination: item.lieuArrivee,
                typeTransport: item.typeTransport,
                time: item.dateHeureDepart,
                arrivalTime: item.dateHeureArrivee,
                duration: Number(item.dureeTotaleEnSecondes || "0"),
                price: Number(item.prix || "0"),
                sections: (item.sections ?? []).map((section: any) => ({
                    modeTransport: section.modeTransport,
                    depart: section.depart,
                    arrivee: section.arrivee,
                    price: Number(section.prix),
                    departureTime: section.dateHeureDepart,
                    arrivalTime: section.dateHeureArrivee,
                })),
            };
        });

    } catch (error) {
        console.error("❌ Erreur API:", error);
        return [];
    }
};


/**
 * 🔥 Annuler une réservation en tant que PMR
 */
export const annulerReservationPMR = async (reservationId: number) => {
    try {
        const token = await getFirebaseToken();
        if (!token) throw new Error("🔴 Impossible de récupérer le token Firebase.");

        const response = await fetch(`${BASE_API_URL}/Reservation/annuler-reservation/${reservationId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Erreur lors de l'annulation de la réservation.");

        console.log("🚀 Réservation annulée :", data);
        return data;
    } catch (error) {
        console.error("❌ Erreur annulation PMR :", error);
        return null;
    }
};

/**
 * 🔥 Libérer une réservation acceptée par un agent
 */
export const libererReservation = async (reservationId: number) => {
    try {
        const token = await getFirebaseToken();
        if (!token) throw new Error("Impossible de récupérer le token Firebase.");

        const response = await fetch(`${BASE_API_URL}/Reservation/liberer-reservation/${reservationId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const text = await response.text(); // ✅ Lire la réponse brute avant de la parser
        if (!response.ok) throw new Error(`Erreur lors de la libération : ${text}`);

        const data = JSON.parse(text);
        console.log("🔄 Réservation libérée :", data);
        return { ...data, status: "pending" }; // ✅ Mise à jour immédiate
    } catch (error) {
        console.error("❌ Erreur libération agent :", error);
        return null;
    }
};



/**
 * 🔥 Terminer une réservation (Mission terminée)
 */
export const terminerReservation = async (reservationId: number) => {
    try {
        const token = await getFirebaseToken();
        if (!token) throw new Error("Impossible de récupérer le token Firebase.");

        const response = await fetch(`${BASE_API_URL}/Reservation/terminer-reservation/${reservationId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const text = await response.text(); // ✅ Lire la réponse brute avant de parser
        if (!response.ok) throw new Error(`Erreur lors de la finalisation : ${text}`);

        const data = JSON.parse(text);
        console.log("✅ Réservation terminée :", data);
        return { ...data, status: "terminée" };
    } catch (error) {
        console.error("❌ Erreur finalisation :", error);
        return null;
    }
};

