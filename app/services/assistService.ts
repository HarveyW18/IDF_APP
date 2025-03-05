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

        console.log(`
            curl --location '${BASE_API_URL}/Reservation/all-reservations' \\
            --header 'Content-Type: application/json' \\
            --header 'Authorization: Bearer ${token}' \\
        `);

        console.log("🔍 Réponse brute API :", response);

        if (!response.ok) throw new Error("Erreur de récupération des réservations.");
        const reservations = await response.json();
        console.log("🚀 Réservations reçues :", reservations);

        // ✅ Fonction pour éviter les erreurs d'accès aux clés undefined
        const safeGet = (obj: any, key: string, defaultValue: string = "Inconnu") => {
            return obj && obj[key] !== undefined ? obj[key] : defaultValue;
        };

        // 🛠️ Traitement des données de l'API
        let assistanceData = reservations.map((item: any) => ({
            id: Number(safeGet(item, "id")),
            pmrName: `${safeGet(item, "nom")} ${safeGet(item, "prenom")}`.trim(),
            status: safeGet(item, "status", "en attente") === "accepted" ? "acceptée" : "en attente",
            departure: safeGet(item, "lieuDepart"),
            destination: safeGet(item, "lieuArrivee"),
            typeTransport: safeGet(item, "typeTransport"),
            time: safeGet(item, "dateHeureDepart"),
            arrivalTime: safeGet(item, "dateHeureArrivee"),
            duration: Number(safeGet(item, "dureeTotaleEnSecondes", "0")),
            price: Number(safeGet(item, "prix", "0")),
            sections: item.sections?.map((section: any) => ({
                modeTransport: safeGet(section, "modeTransport"),
                depart: safeGet(section, "depart"),
                arrivee: safeGet(section, "arrivee"),
                price: Number(safeGet(section, "prix")),
                departureTime: safeGet(section, "dateHeureDepart"),
                arrivalTime: safeGet(section, "dateHeureArrivee"),
            })) || [],
        }));

        // 🔥 Correction de `status`
        assistanceData = assistanceData.map((item) => ({
            ...item,
            status: ["acceptée", "en attente"].includes(item.status) ? item.status : "en attente",
            handicapType: item.handicapType || "",
        }));

        return assistanceData;

    } catch (error) {
        console.error("❌ Erreur API:", error);
        return [];
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

        const responseData = await response.text();
        console.log("📜 Réponse brute reçue :", responseData);


        if (!response.ok) throw new Error("Erreur de récupération des réservations en attente.");
        const reservations = await response.json();
        console.log("🚀 Réservations en attente traitées :", reservations);
        

        return reservations.map((item: any) => ({
            id: Number(item.Id),
            pmrName: `${item.Nom} ${item.Prenom}`.trim(),
            status: "en attente",
            departure: item.LieuDepart,
            destination: item.LieuArrivee,
            typeTransport: item.TypeTransport,
            time: item.DateHeureDepart,
            arrivalTime: item.DateHeureArrivee,
            duration: Number(item.DureeTotaleEnSecondes || "0"),
            price: Number(item.Prix || "0"),
            sections: item.Sections.map((section: any) => ({
                modeTransport: section.ModeTransport,
                depart: section.Depart,
                arrivee: section.Arrivee,
                price: Number(section.Prix),
                departureTime: section.DateHeureDepart,
                arrivalTime: section.DateHeureArrivee,
            })),
        }));
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

        const response = await fetch(`${BASE_API_URL}/Reservation/accepter-reservation/${reservationId.toString()}/${token}`, {
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

        return { ...data, status: data.status === "accepted" ? "acceptée" : data.status };
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
        
        const responseData = await response.text(); // Lire la réponse brute
        console.log("📜 Réponse brute reçue :", responseData);

        if (!response.ok) throw new Error("Erreur de récupération des réservations acceptées.");
        const reservations = await response.json();
        console.log("🚀 Réservations acceptées traitées :", reservations);

        return reservations.map((item: any) => ({
            id: Number(item.Id),
            pmrName: `${item.Nom} ${item.Prenom}`.trim(),
            status: "acceptée",
            departure: item.LieuDepart,
            destination: item.LieuArrivee,
            typeTransport: item.TypeTransport,
            time: item.DateHeureDepart,
            arrivalTime: item.DateHeureArrivee,
            duration: Number(item.DureeTotaleEnSecondes || "0"),
            price: Number(item.Prix || "0"),
            sections: item.Sections.map((section: any) => ({
                modeTransport: section.ModeTransport,
                depart: section.Depart,
                arrivee: section.Arrivee,
                price: Number(section.Prix),
                departureTime: section.DateHeureDepart,
                arrivalTime: section.DateHeureArrivee,
            })),
        }));
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
        return { ...data, status: "en attente" }; // ✅ Mise à jour immédiate
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

