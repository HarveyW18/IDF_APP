import { useState } from "react";
import { obtenirItineraires } from "../services/itineraireService";

const useTrajetViewModel = () => {
    const [trajets, setTrajets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Charge les itinéraires pour un trajet donné.
     * @param {string} depart Lieu de départ.
     * @param {string} arrivee Lieu d'arrivée.
     */
    const chargerItineraires = async (depart: string, arrivee: string) => {
        setLoading(true);
        setError(null);

        try {
            console.log("🔍 Recherche d'itinéraire pour :", depart, "➡️", arrivee);
            const data = await obtenirItineraires(depart, arrivee);

            if (data && data.length > 0) {
                console.log("✅ Itinéraires trouvés :", data.length);
                setTrajets(data[0].sections || []);
            } else {
                setError("❌ Aucun itinéraire trouvé.");
            }
        } catch (err) {
            console.error("❌ Erreur lors de la récupération des itinéraires :", err);
            setError("Erreur lors de la récupération des itinéraires.");
        }

        setLoading(false);
    };

    return { trajets, loading, error, chargerItineraires };
};

export default useTrajetViewModel;
