import { useState } from "react";
import { creerReservationAssistance } from "../services/assistService";

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
            nom: user.nom || "Utilisateur inconnu",
            prenom: user.prenom || "Utilisateur inconnu",
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

        // ✅ Ajouter un log de la requête `curl` pour debug
        console.log(`
            curl --location 'http://192.168.8.4:7595/api/Reservation/demande-assistance' \\
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

export default useAssistViewModel;
