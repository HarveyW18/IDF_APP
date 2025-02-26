import { useState } from "react";
import { creerReservationAssistance } from "../services/assistService";

interface Section {
    departure: { place: { name?: string } };
    arrival: { place: { name?: string } };
    transport?: { mode?: string };
}

const useAssistViewModel = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const demanderAssistance = async (token: string, user: any, trajet: any) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!trajet || !trajet.summary || !trajet.sections || trajet.sections.length === 0) {
            setError("Données du trajet invalides.");
            setLoading(false);
            return;
        }


        // Récupération des infos du trajet
        const prix = trajet.summary?.duration ? trajet.summary.duration * 0.05 : 0; // Ex : tarif basé sur la durée
        const depart = trajet.sections[0].departure.place.name || "Inconnu";
        const arrivee = trajet.sections[trajet.sections.length - 1].arrival.place.name || "Inconnu";
        const typeTransport = trajet.sections.find((s: Section) => s.transport)?.transport?.mode || "inconnu";


        const reservationData = {
            FirebaseUid: user.uid,
            Nom: user.nom,
            Prenom: user.prenom,
            LieuDepart: depart,
            LieuArrivee: arrivee,
            TypeTransport: typeTransport,
            AssistancePMR: true,
            TypeHandicap: "Mobilité réduite",
            Prix: prix,
            Facturation: false,
            Enregistre: false,
            TrajetId: trajet.id || null
        };

        const result = await creerReservationAssistance(token, reservationData);

        if (result) {
            setSuccess(true);
        } else {
            setError("Erreur lors de la création de la réservation.");
        }

        setLoading(false);
    };

    return { demanderAssistance, loading, error, success };
};

export default useAssistViewModel;
