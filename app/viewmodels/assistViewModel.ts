import { useState, useEffect } from "react";
import { creerReservationAssistance, fetchAllAssistances } from "../services/assistService";
import { BASE_API_URL } from "../services/assistService";
import { Assistance } from "../models/Assistance";


interface Section {
    departure: { place: { name?: string } };
    arrival: { place: { name?: string } };
    transport?: { mode?: string };
}

// 🔥 Fonction pour convertir le mode de transport
const convertirModeTransport = (mode: string): string => {
    if (!mode) return "Inconnu";

    switch (mode.toLowerCase()) {
        case "heavy_rail":
        case "train":
            return "SNCF"; // ✅ Trains -> SNCF

        case "subway":
        case "metro":
        case "tram":
            return "RATP"; // ✅ Métro/Tram -> RATP

        case "bus":
            return "RATP"; // ✅ Bus -> RATP

        case "airplane":
            return "Air France"; // ✅ Avion -> Air France

        default:
            return "Inconnu"; // ❌ Ne pas envoyer si inconnu
    }
};

const useAssistViewModel = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const demanderAssistance = async (token: string, user: any, trajet: any, depart: string, arrivee: string) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!user || !user.uid) {
            setError("Utilisateur non authentifié.");
            setLoading(false);
            return;
        }

        if (!trajet || !trajet.summary || !trajet.sections || trajet.sections.length === 0) {
            setError("Données du trajet invalides.");
            setLoading(false);
            return;
        }

        // ✅ Déterminer le type de transport principal
        const typeTransport = convertirModeTransport(
            trajet.sections.find((s: any) => s.transport)?.transport?.mode || "Inconnu"
        );

        if (typeTransport === "Inconnu") {
            setError("Transport non pris en charge.");
            setLoading(false);
            return;
        }

        // ✅ Sécuriser la durée totale en secondes
        const dureeTotaleEnSecondes = trajet.summary?.duration ?? 0;

        // ✅ Calculer dateHeureArrivee de manière sécurisée
        const dateHeureArrivee = dureeTotaleEnSecondes > 0
            ? new Date(Date.now() + dureeTotaleEnSecondes * 1000).toISOString()
            : new Date().toISOString();

        // ✅ Copie indépendante des sections pour éviter toute modification accidentelle
        const sectionsClone = trajet.sections
            .filter((s: any) => s.type === "transit") // ❌ Exclure les "walking"
            .map((s: any) => ({
                modeTransport: convertirModeTransport(s.transport?.mode),
                depart: s.departure?.place?.name || "Départ inconnu",
                arrivee: s.arrival?.place?.name || "Arrivée inconnue",
                prix: 0, // Ajuste si nécessaire
                facturation: false,
                dureeTotaleEnSecondes: s.arrival?.time && s.departure?.time
                    ? (new Date(`1970-01-01T${s.arrival.time}`).getTime() - new Date(`1970-01-01T${s.departure.time}`).getTime()) / 1000
                    : 0,
                distance: 0,
                dateHeureDepart: new Date().toISOString(),
                dateHeureArrivee: dateHeureArrivee,
            }));

        // ✅ Vérification si sectionsClone est vide
        if (sectionsClone.length === 0) {
            setError("Aucune section valide trouvée.");
            setLoading(false);
            return;
        }

        // 🔹 Construire l'objet JSON à envoyer
        const reservationData = {
            firebaseUid: user?.uid || "UID_INCONNU",
            nom: user.firstName || "Utilisateur inconnu",
            prenom: user.lastName || "Utilisateur inconnu",
            lieuDepart: depart,
            lieuArrivee: arrivee,
            typeTransport,
            assistancePMR: true,
            typeHandicap: "Mobilité réduite",
            prix: (dureeTotaleEnSecondes / 60) * 0.05, // Ajuste si nécessaire
            facturation: false,
            enregistre: false,
            dateHeureDepart: new Date().toISOString(),
            dateHeureArrivee: dateHeureArrivee,
            dureeTotaleEnSecondes,
            distanceTotale: 0,
            sections: [...sectionsClone], // ✅ Copie indépendante des sections
        };
        console.log("🔍 JSON avant envoi :", JSON.stringify(reservationData, null, 2));
        

        // ✅ Ajouter un log de la requête `curl` pour debug
        console.log(`
            curl --location '${BASE_API_URL}/Reservation/demande-assistance' \\
            --header 'Content-Type: application/json' \\
            --header 'Authorization: Bearer ${token}' \\
            --data '${JSON.stringify(reservationData)}'
        `);

        // 🔥 Envoi vers l'API
        try {
            const result = await creerReservationAssistance(token, reservationData);

            if (result) {
                setSuccess(true);
            } else {
                setError("Erreur lors de la création de la réservation.");
            }
        } catch (err) {
            setError("Erreur lors de la communication avec l'API.");
            console.error("❌ Erreur API :", err);
        }

        setLoading(false);
    };

    return { demanderAssistance, loading, error, success };
};

const useAssistanceViewModel = () => {
    const [assistances, setAssistances] = useState<Assistance[]>([]);
    const [acceptedMissions, setAcceptedMissions] = useState<Assistance[]>([]);
    const [pendingRequests, setPendingRequests] = useState<Assistance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchAssistances = async () => {
      setLoading(true);
      try {
        const data = await fetchAllAssistances();
        setAssistances(data);
  
        // Séparation des missions acceptées et en attente
        setAcceptedMissions(data.filter((item) => item.status === "acceptée"));
        setPendingRequests(data.filter((item) => item.status === "en attente"));
        
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des assistances.");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchAssistances();
  
      const interval = setInterval(() => {
        fetchAssistances();
      }, 30000);
  
      return () => clearInterval(interval);
    }, []);
  
    return { assistances, acceptedMissions, pendingRequests, loading, error };
  };

  export { useAssistViewModel, useAssistanceViewModel };

