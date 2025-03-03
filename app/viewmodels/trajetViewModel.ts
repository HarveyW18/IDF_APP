import { useState } from "react";
import { obtenirItineraires } from "../services/itineraireService";

// 🔹 Définition du type des trajets
interface Section {
    id: string;
    type: string;
    departure: { time: string; place: { name?: string } };
    arrival: { time: string; place: { name?: string } };
    transport?: { mode?: string; name?: string; category?: string; color?: string; headsign?: string };
}

interface Trajet {
    summary?: { duration?: number };
    sections: Section[];
}

const useTrajetViewModel = () => {
    const [trajets, setTrajets] = useState<Trajet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const chargerItineraires = async (depart: string, arrivee: string) => {
        setLoading(true);
        setError(null);

        try {
            console.log("🔍 [useTrajetViewModel] Recherche d'itinéraire pour :", depart, "➡️", arrivee);
            const data = await obtenirItineraires(depart, arrivee);

            if (data && data.length > 0) {
                const trajetsComplets: Trajet[] = data.map((route: Trajet) => {
                    return {
                        summary: route.summary || { duration: 0 },
                        sections: route.sections || [],
                    };
                });
                
                setTrajets(trajetsComplets);
            } else {
                console.warn("❌ [useTrajetViewModel] Aucun itinéraire trouvé.");
                setTrajets([]);
                setError("Aucun itinéraire trouvé.");
            }
        } catch (err) {
            console.error("❌ [useTrajetViewModel] Erreur lors de la récupération des itinéraires :", err);
            setError("Erreur lors de la récupération des itinéraires.");
        }

        setLoading(false);
    };

    return { trajets, loading, error, chargerItineraires };
};

export default useTrajetViewModel;
